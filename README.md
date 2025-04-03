## CropYield AI - Frontend Application


## Overview

CropYield AI is an intelligent crop yield prediction platform that leverages machine learning to help farmers make data-driven decisions for better harvests and sustainable agriculture. This repository contains the frontend application built with React and Next.js.

## Features

- **AI-Powered Yield Prediction**: Predict crop yields based on location, crop type, weather conditions, and farming practices
- **Interactive Dashboard**: Visualize predictions, historical data, and model performance metrics
- **Model Retraining**: Retrain the AI model with existing data or upload new datasets
- **Data Visualization**: View model evaluation metrics including confusion matrices in a Colab-notebook style
- **Responsive Design**: Fully responsive interface that works on desktop, tablet, and mobile devices


## Technologies Used

- **React**: Frontend UI library
- **Next.js**: React framework for server-side rendering and routing
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Lucide React**: Icon library
- **Chart.js**: Data visualization library



## Installation

1. Clone the repository:

```sh
git clone (https://github.com/lilika67/cropYieldPredictor_fn)
cd cropYield_fn
```


2. Install dependencies:

```sh
npm install
```


3. Start the development server:

```sh
npm run dev
```


4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.


## Usage Guide

### Predicting Crop Yields

1. Click on the "Predict Yield" button in the navigation bar or hero section
2. Fill in the required information:

   - **Area/Location** (e.g., Rwanda)
   - **Crop Type** (e.g., Maize, Rice, Wheat)
   - **Year**
   - **Average Rainfall** (mm)
   - **Pesticides Used** (tonnes)
   - **Average Temperature** (°C)

3. Click "Predict Yield" to get your prediction results


### Retraining the Model

1. Click on the "Retrain Model" button
2. Choose one of the following options:

   - **Use Existing Data**: Retrain the model with data already in the database
   - **Upload New Data**: Navigate to the upload section to provide new training data


### Uploading Training Data

1. Navigate to the "Upload Data" section
2. Drag and drop a CSV file or click to browse your files
3. Click "Upload and Retrain Model"
4. Wait for the retraining process to complete


### Viewing Model Evaluation

1. Navigate to the "Dashboard" section
2. Click on the "Model Evaluation" tab
3. View the confusion matrix and performance metrics
4. Change the color scheme of the confusion matrix using the color selector buttons


## API Endpoints

The frontend communicates with the following API endpoints:

- **Prediction**: `POST https://ezanai.onrender.com/predict/`
- **Retraining**: `POST https://ezanai.onrender.com/retrain/`
- **Upload Data**: `POST https://ezanai.onrender.com/upload/`
- **API Documentation**: `https://ezanai.onrender.com/docs`


## Screenshots

### Home Page
![image](https://github.com/user-attachments/assets/2d496d28-a6d7-407e-9074-847b9c84a62e)


### Prediction Form
![image](https://github.com/user-attachments/assets/b853392f-aa2f-4e8f-96ec-9b7aec263952)

## Components

### Key Components

- **RetrainModal**: Modal for retraining the AI model
- **VisualizationSection**:  section for displaying model performance metrics

```



