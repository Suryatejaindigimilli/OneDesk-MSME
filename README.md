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

(Your name and team details)

## License

Specify if open-source or proprietar
