export interface Bill {
    bill_number: string,
    id: number,
    state: string,
    title: string,
    description: string,
    history: [{}],
    lastAction: any;
    status?: any,
    committee?: any,
    leg_url?: string,
    state_link?: string,
    category?: string,
    uniqueId?: string,
    userId?: string,
    notes?: [{}],
    isUpToDate?: boolean
  }