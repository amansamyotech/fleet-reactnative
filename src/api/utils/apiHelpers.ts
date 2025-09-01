// src/api/utils/apiHelpers.js
// export const parseQueryParams = (params) => {
//     if (!params) return '';
    
//     const queryString = Object.keys(params)
//       .filter(key => params[key] !== undefined && params[key] !== null)
//       .map(key => {
//         const value = params[key];
        
//         if (Array.isArray(value)) {
//           return value
//             .map(item => `${encodeURIComponent(key)}[]=${encodeURIComponent(item)}`)
//             .join('&');
//         }
        
//         return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
//       })
//       .join('&');
      
//     return queryString ? `?${queryString}` : '';
//   };
  
//   export const buildFormData = (data) => {
//     const formData = new FormData();
    
//     Object.keys(data).forEach(key => {
//       if (data[key] !== undefined && data[key] !== null) {
//         // Handle file objects specially
//         if (data[key] && data[key].uri && data[key].type) {
//           formData.append(key, {
//             uri: data[key].uri,
//             type: data[key].type || 'application/octet-stream',
//             name: data[key].name || 'file'
//           });
//         } else {
//           formData.append(key, data[key]);
//         }
//       }
//     });
    
//     return formData;
//   };