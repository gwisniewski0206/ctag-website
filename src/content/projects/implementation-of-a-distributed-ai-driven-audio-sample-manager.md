---
title: "Distributed AI driven Audio Sample Manager for Drum Sound Tagging, Clustering and Recommendations"
summary: "A distributed sample manager that tags, clusters and recommends drum sounds with machine learning – for producers drowning in sample libraries."
year: 2021
team:
  - "Niklas Wantrupp"
tags:
  - "AI"
  - "Web"
links:
  - label: "Code: DrumsampModels"
    url: "https://github.com/NiklasWan/DrumsampModels"
  - label: "Code: DrumsampleTaggerTrain"
    url: "https://github.com/NiklasWan/DrumsampleTaggerTrain"
  - label: "Code: DrumsamplerBackend"
    url: "https://github.com/NiklasWan/DrumsamplerBackend"
  - label: "Code: DrumsamplerFrontend"
    url: "https://github.com/NiklasWan/DrumsamplerFrontend"
  - label: "Dokument (PDF)"
    url: "/uploads/2021/07/AI-Driven-Audio-Sample-Manager.pdf"
order: 3
legacyPaths:
  - "/implementation-of-a-distributed-ai-driven-audio-sample-manager/"
---

### Project Description

Audio industry professionals tend to collect enormous amounts of audio data within their production environment. Foley artists use different kinds of recorded sounds when working on film audio, music producers have libraries of different musical instruments to choose from and game sound designers also have a vast amount of audio files to choose from when designing soundscapes for games.
The process of assembling and manually tagging different audio files takes a huge amount of effort and is extremely time consuming. Audio professionals have to manually listen to all sounds within their library and then introduce meaningful tags to make the vast amount of files accessible for later usage in the production process. Furthermore, the process of finding the right sound in production also can cost a lot of time for the engineer.
To overcome these shortcomings, this project investigates the utilization of artificial intelligence for automatic audio tagging, clustering and recommendation and then the created models are used to implement a distributed audio sample manager. The required data for model training is extracted from the open source online sound library Freesound. In order to curate a representative data set and to refine the scope of the project, solely drum sounds will be used to train the model.
Audio sample tagging models are already well studied and thus a Transfer Learning Approach is chosen where a pre-trained MUSICNN model is chosen and further modified to adapt to the specific use case of drum sound tagging.
The implemented recommendation system and custom audio tagger are both based on k-Nearest Neighbor classifiers (k-NN), working with normalized Mel Frequency Cepstral Coefficients (MFCC) to allow for high accuracy audio recommendation and user customized tagging.
The system is implemented and deployed, using web technologies to allow for user access via web browsers. The backend is built by using the Python Framework Flask to implement a REST-API which exposes all required model computations to the frontend which will use Angular to implement the UI.

### Project Goals

-   Compilation of a Drum Sound Dataset based on sounds from [https://freesound.org/](https://freesound.org/)
-   Implementation of a Drumsample Tagger based on musicnn ([https://github.com/jordipons/musicnn](https://github.com/jordipons/musicnn))
-   Implementation of a Recommendation System based on user history
-   Distributed Sample Manager where the backend is written with Python Flask and the frontend with the Angular framework

### Project Demonstration

https://www.youtube.com/watch?v=G-XRdy5jUT4

### Current Limitations

-   The only supported audio format is wave
-   Users can apply only one custom tag to a given sound
-   JWT authentication and Flask Backend are not ready for deployment, as some security best practices have not been applied because this was beyond the scope for this work
-   User recommendations are not saved to the database, and thus have to be recomputed for every request
-   If a library is fed with new sounds or sounds are renamed, the system has currently no chance in reacting to those circumstances
-   When a dataset becomes large, tensorflow has memory allocation problems

### Links

-   [Drumsample Dataset](https://drive.google.com/drive/folders/11NIT41fifE137b3EvStFIH-1uN_vAEFl?usp=sharing)
-   [DrumsampModels Package](https://github.com/NiklasWan/DrumsampModels)
-   [Drumsample Tagger Training Environment](https://github.com/NiklasWan/DrumsampleTaggerTrain)
-   [Drumsampler Backend](https://github.com/NiklasWan/DrumsamplerBackend)
-   [Drumsampler Frontend](https://github.com/NiklasWan/DrumsamplerFrontend)

### Documentation

[Download](/uploads/2021/07/AI-Driven-Audio-Sample-Manager.pdf)

### Author

*Niklas Wantrupp* 2021
