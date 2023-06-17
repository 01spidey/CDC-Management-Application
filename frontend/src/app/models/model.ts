
export interface serverResponse{
    success : boolean,
    message : string
}

export interface loadMembersResponse{
    success: boolean,
    team_lst : user[]
}

export interface user{
    user_id: string
    name : string,
    mail : string,
    phone : string,
    staff_id : string
}

export interface Report {
    date: string,
    placement_officer_id: string,
    company: string,
    website: string, 
    HR_name: string,
    HR_mail: string,
    contact_mode: string,
    message: string,
    reminder_date: string
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

export interface openMemberResponse{
    success : boolean,
    report_lst : Report[]
}

export interface loginResponse{
    success : boolean,
    message : string,
    user_data : user
}
  