import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: "gyydvjgk",
  api_key: "814515131149345",
  api_secret: "5wspYLiTRftr1ooOwqrMO714aFo",
});

async function test() {
  try {
    const result = await cloudinary.api.ping();
    console.log("SUCCESS! Credentials are valid.");
    console.log(result);
  } catch (error) {
    console.error("ERROR: Credentials failed.");
    console.error(error);
  }
}

test();
