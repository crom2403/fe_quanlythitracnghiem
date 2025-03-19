export const login = async (mssv, pwd) => {
  if (mssv === 'DH52101497' && pwd === '123') {
    return { success: true, role: 'sinhvien' };
  } else if (mssv === 'DH52100000' && pwd === '123') {
    return { success: true, role: 'admin' };
  } else if (mssv === 'DH52100001' && pwd === '123') {
    return { success: true, role: 'giangvien' };
  } else {
    return { success: false };
  }
};
