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
    AffiliatesList: 'affiliates-list',
    BulkAffiliates: 'affiliates-bulk',
    AffiliatesCreate: 'affiliates-create'
}