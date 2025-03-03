//api/api.ts

/**
 Base URL
 **/

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
const authService = process.env.NEXT_PUBLIC_Auth_Service;
const version = process.env.NEXT_PUBLIC_Version

const apiHandle = `${baseURL}${version}`;

const endpoints = {

     //auth
     // register: process.env.NEXT_PUBLIC_REGISTER,
     // refresh: process.env.NEXT_PUBLIC_REFRESH,
     // changePassword: process.env.NEXT_PUBLIC_CHANGE_PASSWORD,
     // codePassword: process.env.NEXT_PUBLIC_RESET_PASSWORD,
     // verifyCode: process.env.NEXT_PUBLIC_VERIFY_CODE,
     logout: process.env.NEXT_PUBLIC_Employee_Logout,
     login: process.env.NEXT_PUBLIC_Employee_Login,
     
     //current user lgin
     // updateProfile: process.env.NEXT_PUBLIC_UPDATE_PROFILE,
     currentUser: process.env.NEXT_PUBLIC_Employee_Detail,

//      //user
//      users: process.env.NEXT_PUBLIC_USERS,
//      blocked: process.env.NEXT_PUBLIC_BLOCKED,
    
//      //queue
//      queueApprove: process.env.NEXT_PUBLIC_QUEUE_BROWSE,
//      activeUser: process.env.NEXT_PUBLIC_ACTIVE_USER,
//      queues: process.env.NEXT_PUBLIC_QUEUES,

//      //category(thể loại)
//      category: process.env.NEXT_PUBLIC_CATEGORY,
//      categories: process.env.NEXT_PUBLIC_CATEGORIES,

//     //role
//      roles:  process.env.NEXT_PUBLIC_ROLES,
//      roleAddUserToManager:  process.env.NEXT_PUBLIC_ADD_MANAGER,
//      blockUser:  process.env.NEXT_PUBLIC_BLOCKED,

//      banner: process.env.NEXT_PUBLIC_BANNER
};

export { apiHandle, endpoints };
