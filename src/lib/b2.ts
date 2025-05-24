// import B2 from 'backblaze-b2';

// export const b2 = new B2({
//   applicationKeyId: "004bf41ae102e8a0000000001",
//   applicationKey: "K004+2QLdFi2FExIRHa8FFZEY/fcVrQ",
//   // applicationKeyId: process.env.B2_KEY_ID!,
//   // applicationKey: process.env.B2_APPLICATION_KEY!,
// });


import B2 from 'backblaze-b2';

export const b2 = new B2({
  applicationKeyId: process.env.B2_KEY_ID!,
  applicationKey: process.env.B2_APPLICATION_KEY!,
});
