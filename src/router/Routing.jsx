import { BrowserRouter, Routes, Route } from "react-router-dom";

//Auth
import { AuthProvider} from "../context/AuthProvider";

//Enum
import { RouterEnum } from "./RouterEnum";

//Components public
import { PublicLayout } from "../components/layout/public/PublicLayout";
import { Login } from "../components/layout/public/auth/login/Login";
import { PageNotFound } from "../components/layout/page404/PageNotFound";

//Components private
import { PrivateLayout } from "../components/layout/private/PrivateLayout";
import { Logout } from "../components/layout/public/auth/logout/Logout";
import { AdministratorList } from "../components/layout/private/admin/list/AdministratorList";
import { AdministratorForm } from "../components/layout/private/admin/form/AdministratorForm";
import { UserList } from "../components/layout/private/user/list/UserList";
import { UserForm } from "../components/layout/private/user/form/UserForm";
import { PQRSList } from "../components/layout/private/pqrs/list/PQRSList";
import { PQRSForm } from "../components/layout/private/pqrs/form/PQRSForm";
import { PQRSObservation } from "../components/layout/private/pqrs/notifications/PQRSObservation";
import {AffiliateList} from "../components/layout/private/affiliate/list/AffiliateList";
import {AffiliateForm} from "../components/layout/private/affiliate/form/AffiliateForm";
import {BulkAffiliates} from "../components/layout/private/affiliate/bulk/BulkAffiliates";

export const Routing = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={ <PublicLayout /> }>
                        <Route index element={ <Login /> } />
                        <Route path={ RouterEnum.Login } element={ <Login /> } />
                    </Route>

                    <Route path={ RouterEnum.RouterAdmin } element={<PrivateLayout /> }>
                        {/* Admin */}
                        <Route path={ RouterEnum.AdministratorList } element={ <AdministratorList /> }  />
                        <Route path={ RouterEnum.CreateAdmin } element={ <AdministratorForm /> }  />
                        <Route path={ RouterEnum.UpdateAdmin } element={ <AdministratorForm /> }  />

                        {/* Users */}
                        <Route path={ RouterEnum.Users } element={ <UserList /> }         />
                        <Route path={ RouterEnum.UsersCreate } element={ <UserForm /> }   />
                        <Route path={ RouterEnum.UsersUpdate } element={ <UserForm /> }   />

                        {/* PQRS */}
                        <Route path={ RouterEnum.PQRSList } element={ <PQRSList /> }   />
                        <Route path={ RouterEnum.PQRSCreate } element={ <PQRSForm /> } />
                        <Route path={ RouterEnum.PQRSUpdate } element={ <PQRSForm /> } />
                        <Route path={ RouterEnum.PQRSObservations } element={ <PQRSObservation /> } />

                        {/* PQRS */}
                        <Route path={ RouterEnum.AffiliatesList } element={ <AffiliateList /> }   />
                        <Route path={ RouterEnum.AffiliatesCreate } element={ <AffiliateForm /> } />
                        <Route path={ RouterEnum.AffiliatesUpdate } element={ <AffiliateForm /> } />
                        <Route path={ RouterEnum.BulkAffiliates } element={ <BulkAffiliates /> }   />

                        {/* Logout */}
                        <Route path={ RouterEnum.Logout } element={ <Logout /> }  />
                    </Route>

                    <Route path="*" element={<PageNotFound />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    )
}