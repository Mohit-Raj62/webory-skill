/**
 * Verification Script for Admin Ambassador Testimonial API
 * Run this with node to check if the admin endpoints are responding.
 */

async function testAdminAPI() {
    console.log("🚀 Starting Admin API Verification...");

    const BASE_URL = "http://localhost:3000";

    // 1. Test GET Ambassador Testimonials (Admin)
    try {
        console.log("Testing GET /api/admin/feedback/ambassador...");
        const res = await fetch(`${BASE_URL}/api/admin/feedback/ambassador`);
        const data = await res.json();
        if (res.ok && data.success) {
            console.log("✅ GET Admin Ambassador Testimonials success! Found:", data.testimonials?.length);
        } else {
            console.warn("⚠️ GET Admin Ambassador Testimonials returned error (might need admin token):", data.error || "Unknown error");
        }
    } catch (e) {
        console.error("❌ Failed to reach GET /api/admin/feedback/ambassador.");
    }

    // 2. Test Public Testimonials (should filter by showTestimonial: true)
    try {
        console.log("Testing GET /api/ambassador/testimonials...");
        const res = await fetch(`${BASE_URL}/api/ambassador/testimonials`);
        const data = await res.json();
        if (res.ok && data.success) {
            console.log("✅ GET Public Testimonials success! Count:", data.data.length);
            console.log("Note: This should only return testimonials where showTestimonial is true.");
        } else {
            console.error("❌ GET Public Testimonials failed:", data.error);
        }
    } catch (e) {
        console.error("❌ Failed to reach GET /api/ambassador/testimonials.");
    }

    console.log("\n📝 Manual verification steps for Admin:");
    console.log("1. Go to /admin/feedback");
    console.log("2. Click on 'Ambassador Testimonials' tab.");
    console.log("3. Verify that you can see ambassador testimonials.");
    console.log("4. Click 'Show' on a testimonial and check the /ambassador landing page.");
    console.log("5. Click 'Hide' and verify it disappears from the landing page.");
}

testAdminAPI();
