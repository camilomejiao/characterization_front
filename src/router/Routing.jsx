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
import {SpecialPopulationList} from "../components/layout/private/special_population/list/SpecialPopulationList";
import {SpecialPopulationForm} from "../components/layout/private/special_population/form/SpecialPopulationForm";
import {AffiliateHistory} from "../components/layout/private/affiliate/affiliate_history/AffiliateHistory";
import {Report} from "../components/layout/private/affiliate/report/Report";

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

                        {/* Afiliados */}
                        <Route path={ RouterEnum.AffiliatesReport } element={ <Report /> }   />
                        <Route path={ RouterEnum.AffiliatesList } element={ <AffiliateList /> }   />
                        <Route path={ RouterEnum.AffiliatesCreate } element={ <AffiliateForm /> } />
                        <Route path={ RouterEnum.AffiliatesUpdate } element={ <AffiliateForm /> } />
                        <Route path={ RouterEnum.BulkAffiliates } element={ <BulkAffiliates /> }   />
                        <Route path={ RouterEnum.AffiliateHistory } element={ <AffiliateHistory /> }   />

                        {/* Listados Censales */}
                        <Route path={ RouterEnum.SpecialPopulationList } element={ <SpecialPopulationList /> }   />
                        <Route path={ RouterEnum.SpecialPopulationCreate } element={ <SpecialPopulationForm /> }   />
                        <Route path={ RouterEnum.SpecialPopulationUpdate } element={ <SpecialPopulationForm /> }   />

                        {/* Logout */}
                        <Route path={ RouterEnum.Logout } element={ <Logout /> }  />
                    </Route>

                    <Route path="*" element={<PageNotFound />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    )
}