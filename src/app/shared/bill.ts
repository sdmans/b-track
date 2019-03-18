export interface Bill {
    bill_number: string,
    id: number,
    state: string,
    title: string,
    description: string,
    history: [{}],
    lastAction: any;
    committee?: string,
    leg_link?: string,
    state_link?: string,
    category?: string,
    uniqueId?: string,
    userId?: string,
    notes?: [{}],
    isUpToDate?: boolean
  }