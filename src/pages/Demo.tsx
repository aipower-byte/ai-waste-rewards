import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Camera, Upload, LogOut, Award, TrendingUp } from "lucide-react";
import type { User } from "@supabase/supabase-js";

const Demo = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [classifying, setClassifying] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check auth status
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        fetchProfile(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        fetchProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (!error && data) {
      setProfile(data);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image under 5MB",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${user?.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from("waste-images")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("waste-images")
        .getPublicUrl(fileName);

      // Convert image to base64 for AI classification
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      // Classify with AI
      setClassifying(true);
      const { data: classificationData, error: classifyError } = await supabase.functions.invoke(
        "classify-waste",
        {
          body: { imageBase64: base64 },
        }
      );

      if (classifyError) throw classifyError;

      setResult(classificationData);

      // Save classification to database
      const { error: dbError } = await supabase
        .from("waste_classifications")
        .insert({
          user_id: user?.id,
          image_url: publicUrl,
          predicted_category: classificationData.category,
          confidence: classificationData.confidence,
          credits_earned: classificationData.creditsEarned,
        });

      if (dbError) throw dbError;

      // Refresh profile to show updated credits
      if (user) {
        await fetchProfile(user.id);
      }

      toast({
        title: "Classification complete!",
        description: `Earned ${classificationData.creditsEarned} EcoCredits`,
      });
    } catch (error: any) {
      console.error("Classification error:", error);
      toast({
        title: "Classification failed",
        description: error.message || "Failed to classify waste. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setClassifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-background to-secondary/20">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm bg-background/50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Camera className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold">EcoSnap</span>
          </div>
          
          <div className="flex items-center gap-4">
            {profile && (
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">EcoCredits</p>
                  <p className="text-2xl font-bold text-gradient">{profile.total_credits}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Classifications</p>
                  <p className="text-2xl font-bold">{profile.total_classifications}</p>
                </div>
              </div>
            )}
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Classify Your <span className="text-gradient">Waste</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Upload a photo and let AI identify the waste category
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Upload Section */}
            <div className="glass-card p-8 rounded-2xl">
              <h2 className="text-2xl font-bold mb-6">Upload Image</h2>
              
              <div className="mb-6">
                <label
                  htmlFor="file-upload"
                  className="block w-full aspect-square border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary transition-colors overflow-hidden"
                >
                  {preview ? (
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                      <Upload className="w-16 h-16 mb-4" />
                      <p className="text-lg font-semibold">Click to upload</p>
                      <p className="text-sm mt-2">PNG, JPG up to 5MB</p>
                    </div>
                  )}
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  disabled={loading}
                  className="hidden"
                />
              </div>

              <Button
                onClick={() => document.getElementById("file-upload")?.click()}
                className="w-full hover-scale"
                disabled={loading}
              >
                {loading ? "Processing..." : classifying ? "Classifying..." : "Select Image"}
              </Button>
            </div>

            {/* Results Section */}
            <div className="glass-card p-8 rounded-2xl">
              <h2 className="text-2xl font-bold mb-6">Classification Result</h2>
              
              {result ? (
                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Category</p>
                    <p className="text-3xl font-bold capitalize text-primary">{result.category}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Confidence</p>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-secondary transition-all"
                          style={{ width: `${result.confidence}%` }}
                        />
                      </div>
                      <span className="text-xl font-bold">{result.confidence}%</span>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Reasoning</p>
                    <p className="text-foreground">{result.reasoning}</p>
                  </div>
                  
                  <div className="glass-card p-4 rounded-xl bg-primary/5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-primary" />
                        <span className="font-semibold">Credits Earned</span>
                      </div>
                      <span className="text-2xl font-bold text-gradient">+{result.creditsEarned}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-center text-muted-foreground">
                  <div>
                    <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Upload an image to see classification results</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Demo;
