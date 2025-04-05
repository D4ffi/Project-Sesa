// Function to smoothly scroll to a section on the page
export const scrollToSection = (sectionId: string): void => {
    // Try to find the element a few times in case the DOM is still loading
    let attempts = 0;
    const maxAttempts = 5;

    const tryScroll = () => {
        const element = document.getElementById(sectionId);

        if (element) {
            // Calculate offset to account for fixed header if needed
            const headerOffset = 80; // Adjust based on your header height
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            // Smooth scroll to the element with offset
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            return true;
        } else if (attempts < maxAttempts) {
            // Element not found yet, try again after a short delay
            attempts++;
            setTimeout(tryScroll, 100);
            return false;
        }

        return false;
    };

    tryScroll();
};

// Function to check if the URL has a hash and scroll to that section
export const scrollToHashSection = (): void => {
    // Check if there's a hash in the URL
    if (window.location.hash) {
        // Get the ID (remove the # symbol)
        const id = window.location.hash.substring(1);

        // Give the browser a moment to finish loading, then scroll
        setTimeout(() => {
            scrollToSection(id);
        }, 100);
    }
};