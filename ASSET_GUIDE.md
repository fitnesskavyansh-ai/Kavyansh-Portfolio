# KAVYANSH SAXENA — THE SERIES
## Asset Management Guide

Welcome to your premium cinematic portfolio! Follow this guide to add your personal photos, certificates, and project assets.

### 1. Folder Structure

All assets are located in the `public/assets/` directory.

-   `profile/`
    -   `profile-main.jpg`: Your main hero image (right side of hero).
    -   `profile-gallery/`: Additional photos of you for the gallery.
-   `hackathons/`
    -   `build-arena/`: Photos for the Build Arena event.
    -   `hackfront/`: Photos for the HackFront event.
    -   `other-events/`: General hackathon photos.
-   `college-events/`: Photos from college activities.
-   `microsoft-visits/`: Photos from Microsoft office visits.
-   `team-photos/`: Group photos with friends/colleagues.
-   `certificates/`
    -   `microsoft/`: Place Microsoft certificates here (JPG or PDF).
    -   `ai-ml/`: Place AI/ML related certificates here.
    -   `programming/`: Place programming certificates here.
-   `projects/`
    -   `studymate/`: Screenshots and cover for StudyMate.
    -   `campuspulse/`: Screenshots and cover for CampusPulse.
-   `resume/`
    -   `resume.pdf`: Your professional resume.

### 2. Registering Assets

After adding files to the folders, you need to update the corresponding JSON files in `src/data/`:

1.  **`profile.json`**: Update your name, title, bio, and social links.
2.  **`projects.json`**: Add/edit project details. Point the `image` field to your asset path.
3.  **`hackathons.json`**: Update event details and accomplishments.
4.  **`certificates.json`**: Add your certification metadata.
5.  **`skills.json`**: List your technical expertise.

### 3. Syncing Assets

The website uses an asset manifest for optimized loading. Whenever you add new files to the `public/assets/` folder, run this command in your terminal:

```bash
npm run assets:sync
```

This will update `src/data/asset-manifest.json` which the app uses to know what files are available.

### 4. Tips for Quality

-   **Hero Image**: Use a high-quality vertical portrait with a dark background or rim lighting for the best "Netflix" look.
-   **Project Covers**: Use 16:9 aspect ratio images.
-   **Certificates**: Use vertical 4:5 aspect ratio for thumbnails.

---
Enjoy building your cinematic journey!
