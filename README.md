# OneDesk-MSME

## Overview

OneDeskMSME is a modern Windows Desktop application designed for MSME shopkeepers to manage their inventory, process billing, and sync data with the cloud. The application ensures a smooth transition from legacy systems while integrating the latest technology to enhance efficiency.

## Features

- **Inventory Management**: Add, update, and track products with details like SKU, purchase date, MRP, expiry, and discounts.
- **Expiry Notifications**: Alerts for products expiring within 30 days.
- **Returns & Cost Calculation**: Manage returns with cost adjustments based on discounts and actual money received.
- **Billing System**: Quick product search, order confirmation, and invoice generation.
- **Cloud Syncing**: Offline functionality with daily cloud synchronization.

## Tech Stack

- **Frontend**: TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js
- **Database**: IndexedDB
- **Cloud Sync**: AWS 

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/Suryatejaindigimilli/OneDesk-MSME
   cd project-folder
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```

## Deployment

- **Local Build:**
  ```sh
  npm run build
  ```
- **Deploying to AWS:**
  - Use AWS Amplify, EC2, or any suitable hosting service.
  - Ensure database synchronization for cloud syncing.

## Usage

- Launch the application.
- Navigate through inventory, billing, and reports.
- Ensure daily sync to keep data updated on the cloud.

## Screenshots

![image](https://github.com/user-attachments/assets/ebe694a0-e748-48c9-af01-43e86976c094)

![image](https://github.com/user-attachments/assets/68629020-e87d-423b-8ee1-f09a9bc68ba0)

![image](https://github.com/user-attachments/assets/6066e516-9a43-43f4-b342-17b760a5406f)

![image](https://github.com/user-attachments/assets/469121df-44d5-4cee-81a4-4bcde12eed26)

![image](https://github.com/user-attachments/assets/36916dfd-9bad-4960-b1ff-22aaed94ac0e)

![image](https://github.com/user-attachments/assets/c6c4173f-5bf9-4ccd-8083-2ec52879b5b5)

## API Endpoints (For Microservices)

- **Inventory API**: `/api/inventory`
- **Billing API**: `/api/billing`
- **Sync API**: `/api/sync`

## Assumptions

- Shopkeepers have stable internet for daily sync.
- Products can be returned with partial refunds.

## Product Demonstration

[Working link](https://one-desk-msme.vercel.app/)

## Contributors

1. Durga Surya Teja Indigimilli (myself)
2. Manikanta Chodisetty

