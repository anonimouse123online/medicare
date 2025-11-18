const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 8000;

// Middleware
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true
}));
app.use(express.json());

// Your Groq API Key
const GROQ_API_KEY = "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";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

// Function to call Groq API
async function queryGroq(prompt) {
    const modelsToTry = [
        "llama-3.2-1b-preview",
        "llama-3.2-3b-preview", 
        "llama-3.2-90b-vision-preview",
        "llama-3.1-8b-instant",
        "mixtral-8x7b-32768"
    ];

    for (const model of modelsToTry) {
        try {
            console.log(`🔄 Trying model: ${model}`);
            
            const response = await fetch(GROQ_API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${GROQ_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    messages: [{ role: 'user', content: prompt }],
                    model: model,
                    temperature: 0.7,
                    max_tokens: 1024
                })
            });

            console.log(`📡 Response status: ${response.status}`);

            if (response.status === 200) {
                const data = await response.json();
                console.log(`✅ Success with model: ${model}`);
                return data.choices[0].message.content;
            } else if (response.status === 400) {
                console.log(`❌ Model ${model} not available, trying next...`);
                continue;
            } else {
                console.log(`⚠️ Model ${model} failed with status ${response.status}`);
                continue;
            }
        } catch (error) {
            console.log(`💥 Error with model ${model}: ${error.message}`);
            continue;
        }
    }

    throw new Error("All Groq models failed");
}

// Search facilities endpoint - AI returns structured JSON
app.post('/search-facilities', async (req, res) => {
    try {
        const { location, facilityType } = req.body;
        
        if (!location) {
            return res.status(400).json({ 
                error: 'Please provide location to search facilities' 
            });
        }

        console.log(`🔍 Searching facilities for:`, { location, facilityType });

        const searchPrompt = `IMPORTANT: Search for medical facilities specifically in "${location}", Cebu, Philippines. 
        DO NOT search in general Cebu City areas unless the user specifically searched for "Cebu City".

        User searched for: "${location}"
        ${facilityType ? `Facility type requested: "${facilityType}"` : ''}

        If "${location}" is a specific area within Cebu (like Mandaue, Lapu-Lapu, Talisay, Consolacion, etc.), 
        find facilities in that EXACT area. If it's a barangay or specific neighborhood, search there.

        Return EXACTLY 5-7 medical facilities that are physically located in or very near "${location}".

        Return ONLY valid JSON array in this exact format:
        [
          {
            "id": 1,
            "name": "Real Hospital Name in ${location}",
            "address": "Exact street address in ${location}, Cebu",
            "distance": "0.5" or "1.2" (estimate distance from ${location} center),
            "type": "Public Hospital/Private Hospital/Clinic",
            "phone": "(032) XXX XXXX",
            "hours": "24/7 Emergency or specific hours",
            "services": ["Emergency Care", "Consultation", "Laboratory", "Pharmacy"]
          }
        ]

        CRITICAL RULES:
        1. Facilities MUST be in "${location}" area, not general Cebu City
        2. If no facilities in "${location}", find the NEAREST ones to "${location}"
        3. Use realistic names and addresses in "${location}"
        4. Distance should be from "${location}" center
        5. Return ONLY the JSON array, no other text or explanations`;

        // Get AI response from Groq
        const aiResponse = await queryGroq(searchPrompt);
        
        console.log(`🏥 AI Response received`);
        console.log(`📊 Response preview: ${aiResponse.substring(0, 200)}...`);

        try {
            // Parse the JSON response directly
            const facilities = JSON.parse(aiResponse);
            
            console.log(`✅ Successfully parsed ${facilities.length} facilities in ${location}`);

            res.json({
                status: "success",
                searchCriteria: { location, facilityType },
                facilities: facilities
            });

        } catch (parseError) {
            console.error(`❌ JSON parse error: ${parseError.message}`);
            // Try one more time with a simpler prompt
            const fallbackPrompt = `Search for medical facilities in "${location}", Cebu. Return JSON array with name, address, type, phone, hours, services. Only JSON.`;
            const fallbackResponse = await queryGroq(fallbackPrompt);
            
            try {
                const facilities = JSON.parse(fallbackResponse);
                res.json({
                    status: "success", 
                    searchCriteria: { location, facilityType },
                    facilities: facilities
                });
            } catch (fallbackError) {
                throw new Error("AI could not find facilities in that location. Please try a different area.");
            }
        }

    } catch (error) {
        console.error(`💥 Error in /search-facilities: ${error.message}`);
        res.status(500).json({
            error: `Facility search failed: ${error.message}`
        });
    }
});

// Quick facility search by location only
app.get('/facilities/search', async (req, res) => {
    try {
        const { q, type } = req.query;
        
        if (!q) {
            return res.status(400).json({ 
                error: 'Please provide a search query' 
            });
        }

        console.log(`🔍 Quick search for: "${q}"`);

        const searchPrompt = `Search for medical facilities specifically in "${q}", Cebu, Philippines. 
        Find facilities physically located in "${q}" area.

        Return JSON array of 5 facilities in "${q}" with: name, address, distance, type, phone, hours, services.
        Distance should be from "${q}" center.

        Only return JSON array, no other text.`;

        // Get AI response from Groq
        const aiResponse = await queryGroq(searchPrompt);

        try {
            const facilities = JSON.parse(aiResponse);
            
            res.json({
                status: "success",
                searchQuery: q,
                facilityType: type,
                facilities: facilities
            });

        } catch (parseError) {
            console.error(`❌ JSON parse error: ${parseError.message}`);
            throw new Error(`Could not find medical facilities in "${q}". Please try a different location.`);
        }

    } catch (error) {
        console.error(`💥 Error in /facilities/search: ${error.message}`);
        res.status(500).json({
            error: `Search failed: ${error.message}`
        });
    }
});

// Health analysis endpoint
app.post('/analyze', async (req, res) => {
    try {
        const { text } = req.body;
        
        if (!text || !text.trim()) {
            return res.status(400).json({ 
                error: 'Please provide symptoms to analyze' 
            });
        }

        console.log(`🎯 Received symptoms: ${text}`);

        const healthPrompt = `As a professional medical AI assistant, analyze these symptoms: "${text}"

Provide a comprehensive health analysis with the following sections:

**SYMPTOM ASSESSMENT:**
Brief overview of the described symptoms

**POSSIBLE CONDITIONS:**
List 2-3 most likely conditions with brief explanations

**RECOMMENDED OTC MEDICATIONS:**
Specific medication suggestions with general guidance

**WHEN TO SEE A DOCTOR:**
Clear indicators for seeking professional medical care

**SELF-CARE ADVICE:**
Practical home care and lifestyle recommendations

**EMERGENCY WARNING SIGNS:**
Symptoms requiring immediate medical attention

**IMPORTANT DISCLAIMER:**
Clear statement that this is AI-generated advice and not a substitute for professional medical care.

Format your response in a clear, organized manner that's easy to read and understand.`;

        // Get AI response from Groq
        const aiResponse = await queryGroq(healthPrompt);
        
        console.log(`📊 AI Response length: ${aiResponse.length} characters`);

        res.json({
            status: "success",
            results: [
                {
                    title: "AI Health Analysis",
                    description: aiResponse
                }
            ]
        });

    } catch (error) {
        console.error(`💥 Error in /analyze: ${error.message}`);
        res.status(500).json({
            error: `Analysis failed: ${error.message}`
        });
    }
});

// Test endpoint to check Groq API
app.get('/test-groq', async (req, res) => {
    try {
        const testPrompt = "Hello, please respond with 'Groq API is working properly!'";
        const response = await queryGroq(testPrompt);
        
        res.json({
            status: "success",
            groq_response: response,
            message: "Groq API test completed"
        });
    } catch (error) {
        res.json({
            status: "error",
            message: `Groq API test failed: ${error.message}`
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: "healthy",
        message: "Health Assistant API is running"
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: "Health Assistant API is running!",
        status: "healthy",
        endpoints: {
            analyze_symptoms: "POST /analyze",
            search_facilities: "POST /search-facilities",
            quick_search: "GET /facilities/search?q=query",
            health_check: "GET /health",
            test_groq: "GET /test-groq"
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🔑 Using Groq API key`);
    console.log(`🏥 AI-powered facility search available`);
});