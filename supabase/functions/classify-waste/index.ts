import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      throw new Error("No image provided");
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    console.log("Classifying waste image with AI...");

    // Call Lovable AI for waste classification
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are an expert waste classification AI. Analyze the image and classify the waste into one of these categories:
- recyclable: plastics, metals, paper, cardboard, glass
- organic: food waste, plant material, biodegradable items
- hazardous: batteries, chemicals, electronics, medical waste
- general: non-recyclable items that don't fit other categories

Respond ONLY with a JSON object in this exact format:
{
  "category": "recyclable|organic|hazardous|general",
  "confidence": 85,
  "reasoning": "Brief explanation of why this classification"
}`
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Please classify this waste item."
              },
              {
                type: "image_url",
                image_url: {
                  url: imageBase64
                }
              }
            ]
          }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits depleted. Please add credits to continue." }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    console.log("AI Response:", aiResponse);

    // Parse the JSON response from AI
    const cleanedResponse = aiResponse.replace(/```json\n?|\n?```/g, '').trim();
    const classification = JSON.parse(cleanedResponse);

    // Validate category
    const validCategories = ["recyclable", "organic", "hazardous", "general"];
    if (!validCategories.includes(classification.category)) {
      throw new Error("Invalid category returned by AI");
    }

    // Calculate credits based on confidence (higher confidence = more credits)
    const baseCredits = 10;
    const confidenceBonus = Math.floor((classification.confidence / 100) * 5);
    const creditsEarned = baseCredits + confidenceBonus;

    return new Response(
      JSON.stringify({
        category: classification.category,
        confidence: classification.confidence,
        reasoning: classification.reasoning,
        creditsEarned,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in classify-waste function:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error occurred" 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
