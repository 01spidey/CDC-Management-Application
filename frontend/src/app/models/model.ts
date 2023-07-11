
export interface serverResponse{
    success : boolean,
    message : string
}

export interface loadMembersResponse{
    success: boolean,
    team_lst : user[]
}

export interface user{
    pk : number,
    user_id: string
    name : string,
    mail : string,
    phone : string,
    staff_id : string
}



export interface drive{
    id : number,
    company : string,
    job_role: string,
    mode: string,
    date: string,
    placement_officer_id: string,
    website : string,
    HR_name : string,
    HR_mail : string,
    HR_contact : string,
    lock_hr_mail : boolean,
    lock_hr_contact : boolean,
    description : string,
    ctc : number,
    completed : boolean,
    category : string,
    departments : string[],
    filters : any,
    rounds : { num : number, name : string}[],
    
}

export interface driveByStatusResponse{
    success : boolean,
    drive_lst : drive[]
}

export interface driveByIdResponse{
    success : boolean,
    drive : drive
}

export interface reportByIdResponse{
    success : boolean,
    report : {
        date: string,
        staff_id: string,
        company: string,
        HR_name: string,
        HR_mail: string,
        contact_mode: string,
        message: string,
        reminder_date: string,
        visibility: string,
        visible_to : string[],
        category : string
    }
}

export interface userByIdResponse{
    success : boolean,
    user : user
}

export interface openMemberResponse{
    success : boolean,
    report_lst : Report[]
}

export interface loginResponse{
    success : boolean,
    message : string,
    user_data : user
}
  
export interface filterOptions{
    category : string,
    period : string,
    startDate : string,
    endDate : string,
    visibility : string,
    staff_id : string
}

export interface getReportsResponse{
    success : boolean,
    reports : Report[]
}

export interface getMembersResponse{
    success : boolean,
    members : string[]
}

// export interface getMemberByIdResponse{
//     success : boolean,
//     member : user
// }

export interface sendOTPResponse{
    success:boolean,
    otp : string,
    user_id : string,
    password : string,
    // key : string
}

export interface reportSummaryResponse{
    success : boolean,
    report_summary : summaryObject[]
}

export interface summaryObject{
    position : number,
    staff_id : string,
    name : string,
    total_reports : number,
    companies : string[]
}

export interface driveNotification{
    company : string,
    date : string,
    role : string,
    mode : string,
    days_left : number,
}

export interface reportNotification{
    pk : number,
    company : string,
    date : string,
    last_message : string,
    last_message_date : string,
    days_left : number,
}

export interface notificationResponse{
    success : boolean,
    notifications : driveNotification[] | reportNotification[],
}

export interface getUserStatsResponse{
    success : boolean,
    stats : {
        reports_today : number,
        reports_week : number,
        reports_month : number,
        drives_today : number,
        drives_week : number,
        drives_month : number
    }
}

interface company_name{
    company : string,
}

export interface getCompanyStatsResponse{
    success : boolean,
    stats : {
        core : company_name[],
        it_product : company_name[],
        it_service : company_name[],
        marketing : company_name[],
        others : company_name[]
    }
}


export interface company{
    id : number,
    company : string,
    HR_name : string,
    HR_mail : string,
    HR_contact : string,
    website : string,
    category : string,
    placement_officer_id : string,
    initiated_at : string,
    last_reminder_date : string,
    lock_hr_contact : boolean,
    lock_hr_mail : boolean,
    name : string,
}

export interface companyByIdResponse{
    success : boolean,
    company : any
}

export interface getCompaniesResponse{
    success : boolean,
    // companies : company[]
    companies : company[]
}

export interface Report {
    pk : number,
    position : number,
    date : string,
    company : string,
    status  : boolean,
    message : string,
    reminder_date : string,
    hr_name : string,
    hr_mail : string,
    time : string,
}

export interface getReportsByCompanyResponse{
    success : boolean,
    reports : Report[]
}

export interface studentTableFilterOptions{
    drive_id : number|null,
    round : Number,
    final_round : boolean,
    checked_students : string[],
    departments : string[],
    batch : string,
    gender : string,
    sslc : {
        medium : string,
        board : string,
        percentage : number[],
    },
    hsc : {
        enabled : boolean,
        medium : string,
        board : string,
        percentage : number[],
        cutoff : number[]
    },
    diploma : {
        enabled : boolean,
        percentage : number[],
    },
    ug : {
        cgpa : number[],
        backlogs : boolean[],
        status : boolean[]
    }
}

export interface filtered_student{
    checked : boolean,
    position : number,
    reg_no : string,
    name : string,
    dept : string,
    batch : string,
    gender : string,
    sslc : {
        percent : number,
        board : string,
        medium : string
    },
    hsc : {
        percent : number,
        cutoff : number,
        board : string,
        medium : string
    },
    diploma : {
        percent : number
    },
    ug : {
        cgpa : number,
        percent : number,
        arrear_history : number,
        standing_arrears : number
    }
}

export interface studentTableFilterResponse{
    success : boolean,
    round_name : string,
    filtered_students : filtered_student[]
}