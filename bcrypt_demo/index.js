const bcrypt = require("bcrypt");

const hashPassword = async (pw) => {
  const hash = await bcrypt.hash(pw, 10);
  console.log(hash);
};

const login = async (pw, hashedPw) => {
  const result = await bcrypt.compare(pw, hashedPw);
  if (result) {
    console.log("berhasil login");
  } else {
    console.log("gagal login");
  }
};

hashPassword("fiesta");
login("fiesta", "2b$10$K6xhIS/RggIS7E96xfSbxOUSHjRmc2qqssvQDzhux1d8V/cqlv5PS");
