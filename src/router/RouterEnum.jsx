export const RouterEnum = {

    //
    Login: 'login',

    //
    Logout: 'logout',

    RouterAdmin: '/admin',

    //Admin
    AdministratorList: 'administrator-list',
    CreateAdmin: 'administrator-create',
    UpdateAdmin: 'administrator-update/:id',

    //Users
    Users: 'user-list',
    UsersCreate: 'user-create',
    UsersUpdate: 'user-update/:id',

    //PQRS
    PQRSList: 'pqrs-list',
    PQRSCreate: 'pqrs-create',
    PQRSUpdate: 'pqrs-update/:id',
    PQRSObservations: 'pqrs-observation/:id',

    //Affiliates
    AffiliatesReport: 'affiliates-report',
    AffiliatesList: 'affiliates-list',
    AffiliatesCreate: 'affiliates-create',
    AffiliatesUpdate: 'affiliates-update/:id',
    BulkAffiliates: 'affiliates-bulk',
    AffiliateHistory: 'affiliate-history/:id',

    //Listados Censales
    SpecialPopulationList: 'special-population-list',
    SpecialPopulationCreate: 'special-population-create',
    SpecialPopulationUpdate: 'special-population-update/:id',
}