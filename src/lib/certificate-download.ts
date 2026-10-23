import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { toast } from "sonner";

export async function downloadCertificateAsPDF(
    elementId: string = "certificate-container",
    fileName: string = "Certificate"
): Promise<boolean> {
    const container = document.getElementById(elementId);
    if (!container) {
        toast.error("Certificate element not found");
        return false;
    }

    const toastId = toast.loading("Generating high-resolution PDF...");

    const originalTransform = container.style.transform;
    const originalTransformOrigin = container.style.transformOrigin;
    const parent = container.parentElement;
    const originalParentWidth = parent?.style.width || "";
    const originalParentHeight = parent?.style.height || "";
    const originalParentOverflow = parent?.style.overflow || "";

    try {
        // Wait for all fonts (Playfair Display, signature fonts, etc.) to load completely
        if (typeof document !== "undefined" && document.fonts) {
            await document.fonts.ready;
        }

        // Temporarily expand to full unscaled A4 dimensions so mobile viewport doesn't clip
        container.style.transform = "none";
        if (parent) {
            parent.style.width = "1122px";
            parent.style.height = "794px";
            parent.style.overflow = "visible";
        }

        // Wait for browser layout recalculation and font rendering
        await new Promise((resolve) => setTimeout(resolve, 150));

        const canvas = await html2canvas(container, {
            scale: 2, // 2x crisp retina clarity
            useCORS: true,
            allowTaint: true,
            backgroundColor: "#ffffff",
            width: 1122,
            height: 794,
            scrollX: 0,
            scrollY: 0,
            windowWidth: 1122,
            windowHeight: 794,
            logging: false,
            onclone: (clonedDoc) => {
                // Ensure cloned certificate container is at standard desktop resolution
                const clonedContainer = clonedDoc.getElementById(elementId);
                if (clonedContainer) {
                    clonedContainer.style.transform = "none";
                    clonedContainer.style.width = "1122px";
                    clonedContainer.style.height = "794px";
                    clonedContainer.style.margin = "0";
                    clonedContainer.style.padding = "0";
                }

                // Inject style to:
                // 1. Disable running animations (e.g. rotating seals) so captured at 0deg
                // 2. Override border-double -> border-solid (html2canvas renders double borders inconsistently)
                const style = clonedDoc.createElement("style");
                style.textContent = `
                    *, *::before, *::after {
                        animation: none !important;
                        transition: none !important;
                    }
                    .border-double {
                        border-style: solid !important;
                    }
                `;
                clonedDoc.head.appendChild(style);

                // Transfer loaded fonts into cloned document
                if (document.fonts && clonedDoc.fonts) {
                    document.fonts.forEach((font) => {
                        try {
                            clonedDoc.fonts.add(font);
                        } catch (e) {
                            // ignore font copy errors
                        }
                    });
                }
            },
        });

        const imgData = canvas.toDataURL("image/jpeg", 0.98);
        const pdf = new jsPDF({
            orientation: "landscape",
            unit: "mm",
            format: "a4",
        });

        pdf.addImage(imgData, "JPEG", 0, 0, 297, 210, undefined, "FAST");
        pdf.save(`${fileName.replace(/[^a-zA-Z0-9_-]/g, "_")}.pdf`);

        toast.success("Certificate downloaded successfully! 🎓", { id: toastId });
        return true;
    } catch (error) {
        console.error("PDF Generation Error:", error);
        toast.error("Failed to generate PDF. You can use the Print option.", { id: toastId });
        return false;
    } finally {
        // Always restore original styles back to mobile responsive view
        container.style.transform = originalTransform;
        container.style.transformOrigin = originalTransformOrigin;
        if (parent) {
            parent.style.width = originalParentWidth;
            parent.style.height = originalParentHeight;
            parent.style.overflow = originalParentOverflow;
        }
    }
}
