import { Member } from "../reports/reports.component"

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

export interface Report {
    position : number
    pk : number,
    date: string,
    staff_id: string,
    company: string,
    HR_name: string,
    HR_mail: string,
    contact_mode: string,
    message: string,
    reminder_date: string,
    visibility: string
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
    description : string,
    file : File|string,
    completed : boolean
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
        visible_to : string[]
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