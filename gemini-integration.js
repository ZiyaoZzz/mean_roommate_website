// Initialize Gemini API
let genAI = null;
let model = null;

function initGeminiAPI() {
  // IMPORTANT: Never expose your API key in client-side code in production!
  // This is for demonstration only - in a real app, use a backend service
  // const API_KEY = "YOUR_API_KEY_HERE"; 
  
  // Instead, prompt the user to enter their key when needed
  const userKey = prompt("Enter your Gemini API key to enable AI-generated roommate responses:");
  
  if (!userKey) {
    alert("API key is required for the AI speech generation feature");
    return false;
  }
  
  try {
    genAI = new window.GoogleGenerativeAI(userKey);
    model = genAI.getGenerativeModel({ model: "gemini-pro" });
    return true;
  } catch (error) {
    console.error("Error initializing Gemini API:", error);
    alert("Failed to initialize the AI. Check your API key and try again.");
    return false;
  }
}

async function generateRoommateResponse(tone, context = {}) {
  if (!genAI || !model) {
    const initialized = initGeminiAPI();
    if (!initialized) return null;
  }
  
  let prompt = "";
  
  switch (tone) {
    case "passive":
      prompt = "Generate a short passive-aggressive response from a roommate who is avoiding responsibility. The response should be brief (1-2 sentences), cold, and dismissive. Make it sound realistic.";
      break;
    case "pitiful":
      prompt = "Generate a short pitiful excuse from a roommate who is trying to avoid responsibility. The response should sound like they're playing the victim (1-2 sentences). Make it sound realistic and guilt-trippy.";
      break;
    case "sophistry":
      prompt = "Generate a short, manipulative response from a roommate who is trying to avoid responsibility through twisted logic. The response should be brief (1-2 sentences), use gaslighting techniques, and appear to shift blame. Make it sound realistic.";
      break;
    default:
      prompt = "Generate a short, dismissive response from a roommate who is avoiding responsibility. Keep it to 1-2 sentences and make it sound realistic.";
  }
  
  // Add context if available
  if (context.issues && context.issues.length > 0) {
    prompt += " The response should relate to at least one of these issues: " + context.issues.join(", ");
  }
  
  try {
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    return response.replace(/^["'](.*)["']$/, '$1'); // Remove quotes if present
  } catch (error) {
    console.error("Error generating content:", error);
    return null;
  }
} 