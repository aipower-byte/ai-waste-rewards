-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum for waste categories
CREATE TYPE public.waste_category AS ENUM ('recyclable', 'organic', 'hazardous', 'general');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  avatar_url TEXT,
  total_credits INTEGER DEFAULT 0 NOT NULL,
  total_classifications INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles RLS policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create waste_classifications table
CREATE TABLE public.waste_classifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  predicted_category waste_category NOT NULL,
  confidence DECIMAL(5,2) NOT NULL CHECK (confidence >= 0 AND confidence <= 100),
  credits_earned INTEGER DEFAULT 10 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on waste_classifications
ALTER TABLE public.waste_classifications ENABLE ROW LEVEL SECURITY;

-- Waste classifications RLS policies
CREATE POLICY "Users can view their own classifications"
  ON public.waste_classifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own classifications"
  ON public.waste_classifications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own classifications"
  ON public.waste_classifications FOR DELETE
  USING (auth.uid() = user_id);

-- Create eco_credits_log table for tracking all credit transactions
CREATE TABLE public.eco_credits_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  classification_id UUID REFERENCES public.waste_classifications(id) ON DELETE SET NULL,
  credits INTEGER NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on eco_credits_log
ALTER TABLE public.eco_credits_log ENABLE ROW LEVEL SECURITY;

-- Eco credits log RLS policies
CREATE POLICY "Users can view their own credits log"
  ON public.eco_credits_log FOR SELECT
  USING (auth.uid() = user_id);

-- Create function to update profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to update profile credits after classification
CREATE OR REPLACE FUNCTION public.update_profile_after_classification()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update profile totals
  UPDATE public.profiles
  SET 
    total_credits = total_credits + NEW.credits_earned,
    total_classifications = total_classifications + 1,
    updated_at = now()
  WHERE id = NEW.user_id;
  
  -- Log the credit transaction
  INSERT INTO public.eco_credits_log (user_id, classification_id, credits, description)
  VALUES (
    NEW.user_id,
    NEW.id,
    NEW.credits_earned,
    'Credits earned for waste classification: ' || NEW.predicted_category
  );
  
  RETURN NEW;
END;
$$;

-- Trigger to update profile after classification
CREATE TRIGGER on_classification_created
  AFTER INSERT ON public.waste_classifications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_profile_after_classification();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for waste images
INSERT INTO storage.buckets (id, name, public)
VALUES ('waste-images', 'waste-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for waste images
CREATE POLICY "Users can upload their own waste images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'waste-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own waste images"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'waste-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Anyone can view waste images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'waste-images');

CREATE POLICY "Users can delete their own waste images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'waste-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );