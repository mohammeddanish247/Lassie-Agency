import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { AddDeliveryNotes, AgreementFormData, CandidateDocuments, IFormData, Order, UserData } from '../components/Interfaces';

const BASE_URL = 'https://lassie.ltd/selectmaids/api';


const OTP_by_phone_no: string = '/get_otp_by_phone_number_for_login.php'
const agency_registration : string = '/agency_registration.php'
const login_by_OTP: string = '/login_by_otp.php'
const country_list_code: string = '/country_list.php '
const category_list: string = '/category_list.php'
const job_list: string = '/job_list.php'
const login_by_MPIN : string = '/login_by_mipn.php'
const candiatate_list: string = '/candiatate_list.php'
const wishlist_candiatate_list: string = '/wishlist_candiatate_list.php'
const job_type :string = '/master_jobtype_list.php'
const job_title : string = '/master_jobtitle_list.php'
const skill_list : string = '/master_skill_list.php'
const order_list : string = '/order_list.php'
const master_maritials_list: string = '/master_maritials_list.php'
const master_religions_list: string = '/master_religions_list.php'
const upload_profile_pic : string = '/agency_profile_photo_update.php'
const upload_certificate : string = '/agency_certificate_update.php'
const upload_logo : string = '/agency_company_logo_update.php'
const profile_update : string = '/agency_profile_update.php'
const ServiceDeliveryList: string = '/service_delivery_notes_list.php'
const ServiceDeliveryDetails: string = 'service_delivery_notes_details.php'
const GetAgreement : string = 'agreement_list.php'
const UpdateMpin : string = 'agency_mipn_update.php'
const AddWishlist : string = 'add_canditate_to_wishlist.php'
const master_heights_list = '/master_heights_list.php'
const master_weights_list = '/master_weights_list.php'
const master_livingarrangements_list = '/master_livingarrangements_list.php'
const master_language_list = '/master_language_list.php'
const master_salaryexpecteds_list = '/master_salaryexpecteds_list.php'
const master_currency_list = '/master_currency_list.php'
const master_typeofvisa_list = '/master_typeofvisa_list.php'
const master_experience_list = '/master_experience_list.php'
const master_addressproofs_list = '/master_addressproofs_list.php'
const master_idproof_list = '/master_idproof_list.php'
const get_employer_details_by_ciof_no= '/get_employer_details_by_ciof_no.php'
const get_agreement_details_by_form_id= '/get_form_details_for_agreement.php'
const create_service_delivery_notes = '/create_service_delivery_notes.php'
const add_agreement = '/create_form_agreement.php'
const add_Candidate = '/add_canditate.php'
const add_Order = 'create_employer_order.php'
const add_canditate_photo_doc = '/add_canditate_photo_doc.php'
const package_list = '/package_list.php'
const create_employer_order_by_share_link = '/create_employer_order_by_share_link.php'
const get_agreement_details = '/agreement_details.php'
const get_employee_details = 'job_details.php'
const varifyEmployer = 'employer_verify_otp_delivery_notes.php'
const varifyCandidate = 'candiate_verify_otp_delivery_notes.php'
const getCV = 'view_cv.php'
const getBanners = 'banner_list.php'
const RemainingContacts = 'canditate_seen_by_agency.php'
const RemainingContacts2 = 'employer_seen_by_agency.php'
const previous_package_book = 'previous_package_book.php'
const sentOTP_ForgotMPIN = 'forget_mipn.php'
const reset_MPIN = 'reset_mipn.php'
const stateList = 'state_list.php'
const cityList = 'city_list.php' 

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });



  export const ApiService = {

    agencyRegistration: async(formData: any) : Promise<any> =>{
      console.log("Danish "+formData);
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        form.append(key, value as string);
      });
      const res = await api.post<any>(agency_registration, formData)
      return res.data
    },

    loginUsingOTP : async(mobile: any, otp : string) => {
      const formData = new FormData();
      formData.append('phone_number', mobile)
      formData.append('user_otp', otp); 
      const res= await api.post<any>(login_by_OTP, formData)
      return res.data
    },

    loginUsingMPIN : async(mobile: any, mpin : string) => {
      const formData = new FormData();
      formData.append('mobile_number', mobile)
      formData.append('mipn', mpin); 
      formData.append('type', 'Agency');
      const res= await api.post<any>(login_by_MPIN, formData)
      return res.data
    },

    getOTPbyPhoneNumber: async(phoneNumber:string) : Promise<any> =>{
    const formData = new FormData();
    formData.append('phone_number', phoneNumber); 
    formData.append('user_type', 'Agency');
      const res= await api.post<any>(OTP_by_phone_no, formData)
      return res.data
    },

    countryListCode: async() => {
      const res = await api.post<any>(country_list_code)
      return res.data
    },

    stateList: async()=>{
      const res = await api.post<any>(stateList)
      return res.data
    },

    cityList: async ()=>{
      const res = await api.post<any>(cityList)
      return res.data
    },
    
    maritalStatus: async() => {
      const res = await api.post<any>(master_maritials_list)
      return res.data
    },

    religionList: async() => {
      const res = await api.post<any>(master_religions_list)
      return res.data
    },

    languageList: async() =>{
      const res = await api.post<any>(master_language_list)
      return res.data
    },

    category_list : async(): Promise<any> =>{
        const res = await api.post<any>(category_list);
        return res.data;
    },

    height_List : async(): Promise<any> =>{
      const res = await api.post<any>(master_heights_list);
      return res.data;
    },
    
    weight_list : async(): Promise<any> =>{
      const res = await api.post<any>(master_weights_list);
      return res.data;
    },

    livingarrangements_list: async() : Promise<any> =>{
      const res = await api.post<any>(master_livingarrangements_list);
      return res.data;
    },

    salaryList: async() :Promise<any> =>{
      const res = await api.post<any>(master_salaryexpecteds_list);
      return res.data;
    },

    curencyList : async() : Promise<any> => {
      const res = await api.post<any>(master_currency_list);
      return res.data;
    },

    typeOfVisaList: async() : Promise<any> =>{
      const res = await api.post<any>(master_typeofvisa_list);
      return res.data;
    },

    experianceList: async() : Promise<any> =>{
      const res = await api.post<any>(master_experience_list);
      return res.data;
    },

    typeOfAddress: async() : Promise<any>=>{
      const res = await api.post<any>(master_addressproofs_list);
      return res.data;
    },

    typeOfIdProof: async() : Promise<any>=>{
      const res = await api.post<any>(master_idproof_list);
      return res.data;
    },

    job_list :  async(page : number, dataForFilter?: any ) : Promise<any> => {
      const formData = new FormData();
      formData.append('page', page.toString()); 
      formData.append('no_of_data', '10');
      if(dataForFilter){
        console.log("dataForFilter "+JSON.stringify(dataForFilter));
        Object.entries(dataForFilter).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            console.log(key, value);
            formData.append(key.toString(), value.toString());
          }
        });
      }
        const res = await api.post<any>(job_list,formData)
        return res.data
    },

    getCandidateList: async (route:string, id: string, page : number, dataForFilter?: any , isWishlist: boolean = false): Promise<any> => {
      const formData = new FormData();
      formData.append('page', page.toString()); 
      formData.append('no_of_data', '10');
      if (route == 'drawer') {
        formData.append('agency_id', id); 
      }
      if(dataForFilter){
        console.log("dataForFilter "+JSON.stringify(dataForFilter));
        Object.entries(dataForFilter).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            console.log(key, value);
            formData.append(key.toString(), value.toString());
          }
        });
      }
      console.log(formData);
      if (isWishlist) {
        const res = await api.post<any>(wishlist_candiatate_list,formData)
        return res.data
      } else {
        const res = await api.post<any>(candiatate_list,formData)
        return res.data
      }
    },

    checkAuth : async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        return token;
      } catch (error) {
        console.error('Error checking auth:', error);
        return false;
      }
    },

    setAuth : async (value : string) => {
      try {
         AsyncStorage.setItem('userToken',value);
      } catch (error) {
        console.error('Error setting auth:', error);
      }
    },

    getUserData: async () => {
      try {
        const data : any = await AsyncStorage.getItem('userData');
        return JSON.parse(data);
      } catch (error) {
        console.error('Error checking auth:', error);
      }
    },


    setUserData : async (data : any) => {
      try {
        AsyncStorage.setItem('userData',JSON.stringify(data)).then(()=>{
          console.log("User Data Saved");
        })
      } catch (error) {
        console.error('Error checking auth:', error);
      }
    },

    getRelativeTime : (timestamp : any)=> {
      const now = new Date();
      const jobDate = new Date(timestamp * 1000); // Convert Unix timestamp to JS Date
      const secondsAgo = Math.floor((now.getTime() - jobDate.getTime()) / 1000);
    
      // Time intervals in seconds
      const intervals = {
        year: 31536000,
        month: 2592000,
        day: 86400,
        hour: 3600,
        minute: 60
      };
    
      // Calculate time differences
      if (secondsAgo < intervals.minute) {
        return "Just now";
      } else if (secondsAgo < intervals.hour) {
        const minutes = Math.floor(secondsAgo / intervals.minute);
        return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
      } else if (secondsAgo < intervals.day) {
        const hours = Math.floor(secondsAgo / intervals.hour);
        return `${hours} hour${hours === 1 ? "" : "s"} ago`;
      } else if (secondsAgo < intervals.month) {
        const days = Math.floor(secondsAgo / intervals.day);
        return days === 1 ? "Yesterday" : `${days} days ago`;
      } else if (secondsAgo < intervals.year) {
        const months = Math.floor(secondsAgo / intervals.month);
        return `${months} month${months === 1 ? "" : "s"} ago`;
      } else {
        const years = Math.floor(secondsAgo / intervals.year);
        return `${years} year${years === 1 ? "" : "s"} ago`;
      }
    },

    get_job_title :  async() => {
        const res = await api.post<any>(job_title)
        return res.data
    },

    get_job_type :  async() => {
      const res = await api.post<any>(job_type)
      return res.data
    },
    get_skills :  async() => {
      const res = await api.post<any>(skill_list)
      return res.data
    },

    get_order :  async(user_id : string) => {
      const formData = new FormData();
      formData.append('user_id', user_id);
      const res = await api.post<any>(order_list,formData)
      return res.data
    },

    uploadProfilePhoto : async(agency_id : string, imageUri : String) =>{
      const formData = new FormData();
      formData.append('agency_id', agency_id);
      formData.append('agency_profile_photo', {
        uri: imageUri,
        type: 'image/jpeg', 
        name: 'profile.jpg',
      } as any); 
      const res = await api.post<any>(upload_profile_pic,formData)
      return res.data
    },

    uploadCertificate : async(agency_id : string, imageUri : String) =>{
      const formData = new FormData();
      formData.append('agency_id', agency_id);
      formData.append('agency_certificate', {
        uri: imageUri,
        type: 'image/jpeg', 
        name: 'certificate.jpg',
      } as any); 
      const res = await api.post<any>(upload_certificate,formData)
      return res.data
    },

    uploadAgencyLogo : async(agency_id : string, imageUri : String) =>{
      const formData = new FormData();
      formData.append('agency_id', agency_id);
      formData.append('company_logo', {
        uri: imageUri,
        type: 'image/jpeg', 
        name: 'company_logo.jpg',
      } as any); 
      const res = await api.post<any>(upload_logo,formData)
      return res.data
    },

    updateProfile: async(userData: UserData) =>{
      const formData = new FormData();
      formData.append('agency_id', userData.user_id);
      formData.append('company_name', userData.company_name);
      formData.append('company_address',userData.company_Address);
      formData.append('pan_no', userData.company_pan_no);
      formData.append('registration_no', userData.company_reg_no);
      formData.append('experience',userData.experience);
      formData.append('gst_no', userData.company_gst_no);
      formData.append('replacement_policy', userData.replacement_policy);
      formData.append('refund_policy', userData.refund_policy);
      formData.append('business_policy', userData.business_Information);
      const res = await api.post<any>(profile_update,formData)
      return res.data
    },

    get_service_delivery_list :  async(user_id: string) => {
       const formData = new FormData();
      formData.append('user_id',user_id)
      const res = await api.post<any>(ServiceDeliveryList,formData)
      return res.data
    },

    get_service_delivery_details :  async(id : number) => {
      const formData = new FormData();
      formData.append('service_delivery_note_id', id.toString());
      const res = await api.post<any>(ServiceDeliveryDetails,formData)
      return res.data
    },

    get_agreements :  async(user_id: string) => {
      console.log("get agreement "+user_id);
      
      const formData = new FormData();
      formData.append('user_id', user_id);
      const res = await api.post<any>(GetAgreement,formData)
      return res.data
    },

    changeMPIN : async(oldMPIN : string, newMPIN : string, user_id : string) => {
      const formData = new FormData();
      formData.append('agency_id', user_id);
      formData.append('mipn', newMPIN);
      formData.append('previous_mipn', oldMPIN);
      const res = await api.post<any>(UpdateMpin, formData)
      return res.data
    },

    addWishList : async( canditate_id : string, user_id :string, value: string) => {
      const formData = new FormData();
      formData.append('agency_id', user_id);
      formData.append('canditate_id', canditate_id);
      formData.append('value', value);
      const res = await api.post<any>(AddWishlist, formData)
      return res.data
    },

    getEmployerDetailsByCiof : async( ciof_no : string) => {
      const formData = new FormData();
      formData.append('ciof_no', ciof_no);
      const res = await api.post<any>(get_employer_details_by_ciof_no, formData)
      return res.data
    },

    getAgreementDetailsByFormid : async( form_id : string) => {
      const formData = new FormData();
      formData.append('form_id', form_id);
      const res = await api.post<any>(get_agreement_details_by_form_id, formData)
      return res.data
    },
    
    addServiceDeliveryNote: async(AddDeliveryNoteData: AddDeliveryNotes, user_id: string)=>{
      const formData = new FormData();
      formData.append('user_id',user_id)
      formData.append('ciof_no',AddDeliveryNoteData.ciof_no)
      formData.append('canditate_name',AddDeliveryNoteData.canditate_name)
      formData.append('canditate_mobile',AddDeliveryNoteData.canditate_mobile)
      formData.append('canditate_family',AddDeliveryNoteData.canditate_family)
      formData.append('canditate_address',AddDeliveryNoteData.canditate_address)
      formData.append('canditate_document_no',AddDeliveryNoteData.canditate_document_no)
      formData.append('esalary',AddDeliveryNoteData.esalary)
      formData.append('ejoindate',AddDeliveryNoteData.ejoindate)
      formData.append('ejobcategory',AddDeliveryNoteData.ejobcategory)
      formData.append('registrationcharge',AddDeliveryNoteData.registrationcharge)
      formData.append('transportcharge',AddDeliveryNoteData.transportcharge)
      formData.append('consultantcharges',AddDeliveryNoteData.consultantcharges)
      const res = await api.post<any>(create_service_delivery_notes, formData)
      return res.data
    },

    addCandidate: async(data : Partial<IFormData>, id: string)=>{
      const formData = new FormData();
      formData.append('agency_id', id)
      formData.append('jobseeker_locality', 'NA')
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });
      const res = await api.post<any>(add_Candidate, formData)
      return res.data
    },

    uploadCandidateDocPics: async (agencyid: string, CandidateId: string, CandidateDocs: CandidateDocuments) =>{
      const formData = new FormData();
       formData.append('agency_id', agencyid)
       formData.append('canditate_id', CandidateId) 
       formData.append('canditate_image',{uri: CandidateDocs.canditate_image,type: 'image/jpeg', name: 'candidateImage.jpg',} as any);
       formData.append('id_proof_image', {uri: CandidateDocs.id_proof_image,type: 'image/jpeg', name: 'candidateIdProofImage.jpg',} as any);
       formData.append('address_proof_image', {uri: CandidateDocs.address_proof_image,type: 'image/jpeg', name: 'candidateAddressProofImage.jpg',} as any);
       const res = await api.post<any>(add_canditate_photo_doc, formData)
      return res.data
    },

    getPackages: async ()=>{
      const formData = new FormData()
      formData.append('type','Agency')
      const res = await api.post<any>(package_list, formData)
      return res.data
    },
    
    addAgreemnet: async(data: AgreementFormData, user_id: string)=>{
      const formData = new FormData();
      formData.append('user_id', user_id);
      formData.append('form_id', data.form_id);
      formData.append('food', data.food);
      formData.append('living', data.living);
      formData.append('working_hour', data.working_hour);
      formData.append('free_replacment', data.free_replacment); // Note the typo matches your interface
      formData.append('agr_validity', data.agr_validity);
      formData.append('consulting_charge', data.consulting_charge);
      formData.append('pay_type', data.pay_type);
      formData.append('month_deduction', data.month_deduction);
      formData.append('place', data.place);
      const res = await api.post<any>(add_agreement, formData)
      return res.data
    },

    create_employer_order_by_share_link: async (mobile : string)=>{
      const formData = new FormData()
      formData.append('mobile',mobile)
      const res = await api.post<any>(create_employer_order_by_share_link, formData)
      return res.data
    },

      addOrder: async(data : Order, user_id: string)=>{
      const formData = new FormData();
      formData.append('user_id', user_id);
      Object.entries(data).forEach(([key, value]) => {
        console.log(key, value);
        formData.append(key, value.toString());
      });
      const res = await api.post<any>(add_Order, formData)
      return res.data
    },

    get_Full_Agreement_Details: async(form_id : string)=>{
      const formData = new FormData();
      formData.append('agreement_id', form_id);
      const res = await api.post<any>(get_agreement_details, formData)
      return res.data
    },

    get_Employee_Details: async (job_id : string) => {
       const formData = new FormData();
      formData.append('job_id', job_id);
      const res = await api.post<any>(get_employee_details, formData)
      return res.data
    },

    verifyEmployer: async (formId : string) => {
      console.log(formId);
       const formData = new FormData();
      formData.append('service_delivery_note_id', formId);
      const res = await api.post<any>(varifyEmployer, formData)
      return res.data
    },

    verifyCandidate: async (formId : string) => {
      console.log(formId);
      const formData = new FormData();
      formData.append('service_delivery_note_id', formId);
      const res = await api.post<any>(varifyCandidate, formData)
      return res.data
    },

    getCV : async (id : string, user_id: string) => {
      const formData = new FormData();
      formData.append('candidate_id', id);
      formData.append('agency_id', user_id);
      const res = await api.post<any>(getCV, formData)
      return res.data
    },

    getBannersImg : async () => {
      const res = await api.post<any>(getBanners)
      return res.data
    },

    ViewCandidate : async (cid: string, uid:string) => {
      const formData = new FormData();
      formData.append('canditate_id', cid);
      formData.append('user_id', uid);
      formData.append('type', 'Agency');
      const res = await api.post<any>(RemainingContacts, formData)
      return res.data
    },

    ViewEmployer : async (eid: string, uid:string) => {
      const formData = new FormData();
      formData.append('emp_id', eid);
      formData.append('user_id', uid);
      formData.append('type', 'Agency');
      const res = await api.post<any>(RemainingContacts2, formData)
      return res.data
    },

    PreviousPackage : async (uid:string) => {
      const formData = new FormData();
      formData.append('user_id', uid);
      formData.append('type', 'Agency');
      const res = await api.post<any>(previous_package_book, formData)
      return res.data
    },

    sentOTP_ForgotMPIN : async (mobile: any) => {
        const formData = new FormData();
        formData.append('mobile_number', mobile);
        formData.append('type', 'Agency');
        const res = await api.post<any>(sentOTP_ForgotMPIN, formData)
        return res.data
    },

     resetMPIN : async (mobile: any, mpin: string) => {
        const formData = new FormData();
        formData.append('mobile_number', mobile);
        formData.append('type', 'Agency');
        formData.append('mipn', mpin);
        const res = await api.post<any>(reset_MPIN, formData)
        return res.data
    }
}
