function initialiseAddToHomeService(): void {
    window.addEventListener('beforeinstallprompt', (event: Event) => {
        console.log("beforeinstallprompt");

        // Cast the event to the correct type (BeforeInstallPromptEvent)
        const installPromptEvent = event as BeforeInstallPromptEvent;

        // Prevent the mini-infobar from appearing on mobile
        installPromptEvent.preventDefault();

        // Store the event so it can be triggered later
        installPromptEvent.userChoice.then((choiceResult: any) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('App Installed');
            } else {
                console.log('App not installed');
            }
        });
    });
}

// Define the BeforeInstallPromptEvent type since it's not part of the standard DOM types
interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[];
    readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
    prompt(): Promise<void>;
}

export {
    initialiseAddToHomeService
};
