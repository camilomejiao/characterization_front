import { BrowserRouter, Routes, Route } from "react-router-dom";

//Auth
import { AuthProvider } from "../context/AuthProvider";

//Enum
import { RouterEnum } from "./RouterEnum";

//Components public
import { PublicLayout } from "../layout/PublicLayout";
import { Login } from "../pages/auth/Login";
import { PageNotFound } from "../layout/PageNotFound";

//Components private
import { PrivateLayout } from "../layout/PrivateLayout";
import { Logout } from "../pages/auth/Logout";
import { AdministratorList } from "../pages/admin/list/AdministratorList";
import { AdministratorForm } from "../pages/admin/form/AdministratorForm";
import { UserList } from "../pages/user/list/UserList";
import { UserForm } from "../pages/user/form/UserForm";
import { PQRSList } from "../pages/pqrs/list/PQRSList";
import { PQRSForm } from "../pages/pqrs/form/PQRSForm";
import { PQRSObservation } from "../pages/pqrs/notifications/PQRSObservation";
import { AffiliateList } from "../pages/affiliate/list/AffiliateList";
import { AffiliateForm } from "../pages/affiliate/form/AffiliateForm";
import { BulkAffiliates } from "../pages/affiliate/bulk/BulkAffiliates";
import { SpecialPopulationList } from "../pages/special-population/list/SpecialPopulationList";
import { SpecialPopulationForm } from "../pages/special-population/form/SpecialPopulationForm";
import { AffiliateHistory } from "../pages/affiliate/affiliate_history/AffiliateHistory";
import { Report } from "../pages/affiliate/report/Report";

export const Routing = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<PublicLayout />}>
                        <Route index element={<Login />} />
                        <Route path={RouterEnum.Login} element={<Login />} />
                    </Route>

                    <Route path={RouterEnum.RouterAdmin} element={<PrivateLayout />}>
                        {/* Admin */}
                        <Route
                            path={RouterEnum.AdministratorList}
                            element={<AdministratorList />}
                        />
                        <Route path={RouterEnum.CreateAdmin} element={<AdministratorForm />} />
                        <Route path={RouterEnum.UpdateAdmin} element={<AdministratorForm />} />

                        {/* Users */}
                        <Route path={RouterEnum.Users} element={<UserList />} />
                        <Route path={RouterEnum.UsersCreate} element={<UserForm />} />
                        <Route path={RouterEnum.UsersUpdate} element={<UserForm />} />

                        {/* PQRS */}
                        <Route path={RouterEnum.PQRSList} element={<PQRSList />} />
                        <Route path={RouterEnum.PQRSCreate} element={<PQRSForm />} />
                        <Route path={RouterEnum.PQRSUpdate} element={<PQRSForm />} />
                        <Route path={RouterEnum.PQRSObservations} element={<PQRSObservation />} />

                        {/* Afiliados */}
                        <Route path={RouterEnum.AffiliatesReport} element={<Report />} />
                        <Route path={RouterEnum.AffiliatesList} element={<AffiliateList />} />
                        <Route path={RouterEnum.AffiliatesCreate} element={<AffiliateForm />} />
                        <Route path={RouterEnum.AffiliatesUpdate} element={<AffiliateForm />} />
                        <Route path={RouterEnum.BulkAffiliates} element={<BulkAffiliates />} />
                        <Route path={RouterEnum.AffiliateHistory} element={<AffiliateHistory />} />

                        {/* Listados Censales */}
                        <Route
                            path={RouterEnum.SpecialPopulationList}
                            element={<SpecialPopulationList />}
                        />
                        <Route
                            path={RouterEnum.SpecialPopulationCreate}
                            element={<SpecialPopulationForm />}
                        />
                        <Route
                            path={RouterEnum.SpecialPopulationUpdate}
                            element={<SpecialPopulationForm />}
                        />

                        {/* Logout */}
                        <Route path={RouterEnum.Logout} element={<Logout />} />
                    </Route>

                    <Route path="*" element={<PageNotFound />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
};
