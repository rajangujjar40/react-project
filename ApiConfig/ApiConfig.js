// export const baseurl = "https://node-arcadegame.mobiloitte.io"; //stagging
export const baseurl = "http://182.74.213.163:2061"; //ip
// export const baseurl = "http://172.16.2.11:1990"; //local Nikhil
// export const baseurl = "http://172.16.1.53:1990"; //local Kamal
// export const baseurl = "http://172.16.6.96:1990"; //local Ritik

const url = `${baseurl}/api/v1`;

const ApiConfig = {
  //ADMIN AUTH
  login: `${url}/admin/login`,
  forgotPassword: `${url}/admin/forgotPassword`,
  verifyOTP: `${url}/admin/verifyOTP`,
  resetPassword: `${url}/admin/resetPassword`,
  changePassword: `${url}/admin/changePassword`,
  getProfile: `${url}/admin/getProfile`,
  editProfile: `${url}/admin/editProfile`,
  resendOtp: `${url}/admin/resendOtp`,
  graphDW: `${url}/admin/graphDW`,

  //USER MANAGEMENT
  userList: `${url}/admin/userList`,
  viewUser: `${url}/admin/viewUser`,
  deleteUser: `${url}/admin/deleteUser`,
  activeBlockUser: `${url}/admin/activeBlockUser`,
  editUserProfile: `${url}/admin/editUserProfile`,

  //CATEGORY MANAGEMENT
  listCategory: `${url}/category/listCategory`,
  adminListCategory: `${url}/category/adminListCategory`,
  deleteCategory: `${url}/category/deleteCategory`,
  viewCategory: `${url}/category/viewCategory`,
  editCategory: `${url}/category/editCategory`,
  activeDeactiveCategory: `${url}/category/activeDeactiveCategory`,
  addCategory: `${url}/category/addCategory`,

  //STATIC MANAGEMENT
  staticContentList: `${url}/static/staticContentList`,
  viewStaticContent: `${url}/static/viewStaticContent`,
  editStaticContent: `${url}/static/editStaticContent`,
  addStaticContent: `${url}/static/addStaticContent`,

  //FAQ MANAGEMENT
  faqList: `${url}/static/faqList`,
  deleteFAQ: `${url}/static/deleteFAQ`,
  editFAQ: `${url}/static/editFAQ`,
  addFAQ: `${url}/static/addFAQ`,
  viewFAQ: `${url}/static/viewFAQ`,

  //TICKET MANAGEMENT
  getTickets: `${url}/ticket/getTickets`,
  createTicket: `${url}/ticket/createTicket`,
  updateTicket: `${url}/ticket/updateTicket`,
  blockTicket: `${url}/ticket/blockTicket`,
  deleteTicket: `${url}/ticket/deleteTicket`,
  viewTicket: `${url}/ticket/viewTicket`,

  //GAME MANAGEMENT
  listgame: `${url}/game/listgame`,
  editgame: `${url}/game/editgame`,
  addGame: `${url}/game/addGame`,
  viewgame: `${url}/game/viewgame`,
  activeDeactiveGame: `${url}/game/activeDeactiveGame`,
  deletegame: `${url}/game/deletegame`,

  //NOTIFICATION MANAGEMENT
  listNotification: `${url}/notification/listNotification`,
  viewNotification: `${url}/notification/viewNotification`,
  deleteNotification: `${url}/notification/deleteNotification`,

  //WALLET MANAGEMENT
  transactionHistory: `${url}/ticket/transactionHistory`,
  viewTransactionHistory: `${url}/ticket/viewTransactionHistory`,
  approveRejectWithdrawal: `${url}/ticket/approveRejectWithdrawal`,

  //DASHBOARD MANAGEMENT
  dashBoard: `${url}/admin/dashBoard`,

  //ANNOUNCEMENT MANAGEMENT
  listAnnouncement: `${url}/notification/listAnnouncement`,
  deleteAnnouncement: `${url}/notification/deleteAnnouncement`,
  viewAnnouncement: `${url}/notification/viewAnnouncement`,
  updateAnnouncement: `${url}/notification/updateAnnouncement`,
  addAnnouncement: `${url}/notification/addAnnouncement`,

  //BANNER MANAGEMENT
  addBanner: `${url}/banner/addBanner`,
  listBanner: `${url}/banner/listBanner`,
  viewBanner: `${url}/banner/viewBanner`,
  editBanner: `${url}/banner/editBanner`,
  deleteBanner: `${url}/banner/deleteBanner`,
  activeDeactiveBanner: `${url}/banner/activeDeactiveBanner`,

  //CONTACT US MANAGEMENT
  getContactUs: `${url}/user/getContactUs`,
  viewContactsUs: `${url}/user/viewContactsUs`,
  replyContactUs: `${url}/admin/replyContactUs`,

  //LEVEL & MULTILEVEL MANAGEMENT
  getLevelPrize: `${url}/admin/getLevelPrize`,
  editLevelPrize: `${url}/admin/editLevelPrize`,

  //SUBADMIN MANAGEMENT
  addSubAdmin: `${url}/admin/addSubAdmin`,
  listSubAdmin: `${url}/admin/listSubAdmin`,
  editProfileSubAdmin: `${url}/admin/editProfileSubAdmin`,
  deleteSubAdmin: `${url}/admin/deleteSubAdmin`,
  blockUnblockSubAdmin: `${url}/admin/blockUnblockSubAdmin`,
};
export default ApiConfig;
