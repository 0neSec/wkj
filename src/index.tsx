import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

/**
 * Copyright (c) 2024 Mohamad khadik & Mohamad Idham Bahri. All rights reserved.
 *
 * This code is the confidential and proprietary information of Mohamad khadik & Mohamad Idham Bahri
 * You shall not disclose or use it except in accordance with the terms
 * of the license agreement you entered into with Mohamad khadik & Mohamad Idham Bahri.
 */

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
);


reportWebVitals();
