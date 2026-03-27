/**
 * Verification Script for Ambassador Testimonial API
 * Run this with node to check if the new endpoints are responding.
 * Note: This assumes you have a valid local or dev environment.
 */

async function testAPI() {
    console.log("🚀 Starting API Verification...");

    // 1. Test GET Testimonials (Public)
    try {
        console.log("Testing GET /api/ambassador/testimonials...");
        const res = await fetch("http://localhost:3000/api/ambassador/testimonials");
        const data = await res.json();
        if (res.ok && data.success) {
            console.log("✅ GET Testimonials success! Found:", data.data.length);
        } else {
            console.warn("⚠️ GET Testimonials returned error (might be expected if no data):", data.error || "Unknown error");
        }
    } catch (e) {
        console.error("❌ Failed to reach GET /api/ambassador/testimonials. Make sure server is running on port 3000.");
    }

    // 2. Test GET Top (Leaderboard) - should still work
    try {
        console.log("Testing GET /api/ambassador/top...");
        const res = await fetch("http://localhost:3000/api/ambassador/top");
        const data = await res.json();
        if (res.ok && data.success) {
            console.log("✅ GET Top success! Found:", data.data.length);
        } else {
            console.error("❌ GET Top failed:", data.error);
        }
    } catch (e) {
        console.error("❌ Failed to reach GET /api/ambassador/top.");
    }

    console.log("\n📝 Manual verification steps:");
    console.log("1. Go to /ambassador/dashboard");
    console.log("2. Use the 'What You Say' section to save a testimonial.");
    console.log("3. Verify the toast notification.");
    console.log("4. Check /ambassador landing page to see if your testimonial appears.");
}

testAPI();
