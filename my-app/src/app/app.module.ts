import { BrowserModule } from '@angular/platform-browser';

import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {MaterialsComponent} from './materials/MaterialsMainComponent/materials.component';
import { CreateNewMaterialComponent } from './materials/create-new-material/create-new-material.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SortDirective } from './helpers/directive/sort.directive';
import { MaterialSearchDirective } from './helpers/directive/ForMaterials/material-search.directive';
import {RouterModule} from '@angular/router';
import { UpdateMaterialComponent } from './materials/update-material/update-material.component';
import {MaterialBackendService} from './materials/MaterialServices/material-backend.service';
import {ValidateMaterialCodeUniqueService} from './materials/MaterialServices/validate-material-code-unique.service';
import {MaterialTableService} from './materials/MaterialServices/material-table.service';
import { LoginComponent } from './LoginandLogOut/login/loginComponent/login.component';
import { HeaderComponent } from './header/header/header.component';
import {AddAuthorizationCookieInterceptorService} from './helpers/interceptors/add-authorization-cookie-interceptor.service';
import { OrdersComponent } from './Orders/orders/OrdersMainComponent/orders.component';
import { ProductComponent } from './Products/ProductMainComponent/product/product.component';
import { ProductTopComponent } from './Products/ProductTop/product-top/product-top.component';
import { ProductBottomComponent } from './Products/ProductBottom/product-bottom/product-bottom.component';
import { UsersComponent } from './Users/UsersMainComponent/users.component';
import { BusinessPartnersComponent } from './BusinessPartners/business-partners/BusinessPartnerMainComponent/business-partners.component';
import { ProductTypeComponent } from './Products/ProductType/product-type/product-type.component';
import {ErrorsInterceptorService} from './helpers/interceptors/intercept-errors.service';
import { AdminSerchDirective } from './helpers/directive/ForUsers/admin-serch.directive';
import { EditorsSearchDirectiveDirective } from './helpers/directive/ForUsers/editors-search-directive.directive';
import { UpdateUserComponent } from './Users/update-user/update-user.component';
import { CreateNewUserComponent } from './Users/create-new-user/create-new-user.component';
import { ChangePasswordComponent } from './Users/change-password/change-password.component';
import { BusinessPartnerChangePasswordComponent } from './BusinessPartners/business-partners/ChangePassword/business-partner-change-password/business-partner-change-password.component';
import { CreateBusinesPartnerComponent } from './BusinessPartners/business-partners/CreateBusinessPartner/create-busines-partner/create-busines-partner.component';
import { UpdateBusinessPartnerComponent } from './BusinessPartners/business-partners/UpdateBusinessPartner/update-business-partner/update-business-partner.component';
import { PartersSearchDirective } from './helpers/directive/ForPartners/parters-search.directive';
import { CreateProductTopComponent } from './Products/ProductTop/create-product-top/create-product-top.component';
import { ProductTopSearchDirective } from './helpers/directive/ForProductTop/product-top-search.directive';
import { ProductBottomSearchDirective } from './helpers/directive/ForProductBottom/product-bottom-search.directive';
import { CreateProductBottomComponent } from './Products/ProductBottom/create-product-bottom/create-product-bottom.component';
import { CreateProductTypeComponent } from './Products/ProductType/create-product-type/create-product-type.component';
import { ProductTypeSearchDirective } from './helpers/directive/ForProductType/product-type-search.directive';
import { CreateProductComponent } from './Products/ProductMainComponent/product/create-product/create-product.component';
import { SearchDirectiveWithRandomChars } from './helpers/directive/ForProducts/search-directive-with-random-chars.directive';
import { ProductTableFormComponent } from './Products/ProductMainComponent/product/product-table-form/product-table-form.component';
import { CreateOrderComponent } from './Orders/orders/create-order/create-order.component';
import { UpdateOrderComponent } from './Orders/orders/update-order/update-order.component';
import { OrderVersionRegisterComponent } from './Orders/orders/order-version-register/order-version-register.component';
import { OrderSearchDirectiveDirective } from './helpers/directive/ForOrders/order-search-directive.directive';
import { OrderDrawingComponent } from './Orders/orders/order-drawing/order-drawing.component';
import { DimensionCodesMainComponent } from './DimensionCodes/dimension-codes-main/dimension-codes-main.component';
import { CreateDimensionCodeComponent } from './DimensionCodes/create-dimension-code/create-dimension-code.component';
import { DimensionSearchDirective } from './helpers/directive/ForDimensionCode/dimension-search.directive';
import { LanguageMainComponent } from './Languages/language-main/language-main.component';
import { CreateOrUpdateLanguageComponent } from './Languages/create-or-update-language/create-or-update-language.component';
import { LanguageSearchDirective } from './helpers/directive/ForLanguages/language-search.directive';
import { SearchDirective } from './helpers/directive/SearchDirective/search.directive';
import { LangageFormComponentComponent } from './LanguageForm/langage-form-component/langage-form-component.component';
import { VocabularyMainComponentComponent } from './Vocablulaty/vocabulary-main-component/vocabulary-main-component.component';
import { CreateOrUpdateVocabularyComponent } from './Vocablulaty/create-or-update-vocabulary/create-or-update-vocabulary.component';
import { ChangePasswordForLoggedUserComponent } from './change-password-component/change-password-for-logged-user.component';
import { ProcutMiniatureComponentComponent } from './Orders/orders/productMiniature/procut-miniature-component/procut-miniature-component.component';
import { ConfirmDeleteComponent } from './ConfirmDelete/confirm-delete/confirm-delete.component';
import { OperationStatusComponent } from './OperationStatusComponent/operation-status/operation-status.component';
import { ValidationErrorMessageComponent } from './ValidationMessage/validation-error-message/validation-error-message.component';
import { GeneretePasswordDirective } from './helpers/directive/GeneratePasswordDirective/generete-password.directive';





@NgModule({
  declarations: [
    AppComponent,
    MaterialsComponent,
    CreateNewMaterialComponent,
    SortDirective,
    MaterialSearchDirective,
    UpdateMaterialComponent,
    LoginComponent,
    HeaderComponent,
    OrdersComponent,
    ProductComponent,
    ProductTopComponent,
    ProductBottomComponent,
    UsersComponent,
    BusinessPartnersComponent,
    ProductTypeComponent,
    AdminSerchDirective,
    EditorsSearchDirectiveDirective,
    UpdateUserComponent,
    CreateNewUserComponent,
    ChangePasswordComponent,
    BusinessPartnerChangePasswordComponent,
    CreateBusinesPartnerComponent,
    UpdateBusinessPartnerComponent,
    PartersSearchDirective,
    CreateProductTopComponent,
    ProductTopSearchDirective,
    ProductBottomSearchDirective,
    CreateProductBottomComponent,
    CreateProductTypeComponent,
    ProductTypeSearchDirective,
    CreateProductComponent,
    SearchDirectiveWithRandomChars,
    ProductTableFormComponent,
    CreateOrderComponent,
    UpdateOrderComponent,
    OrderVersionRegisterComponent,
    OrderSearchDirectiveDirective,
    OrderDrawingComponent,
    DimensionCodesMainComponent,
    CreateDimensionCodeComponent,
    DimensionSearchDirective,
    LanguageMainComponent,
    CreateOrUpdateLanguageComponent,
    LanguageSearchDirective,
    SearchDirective,
    LangageFormComponentComponent,
    VocabularyMainComponentComponent,
    CreateOrUpdateVocabularyComponent,
    ChangePasswordForLoggedUserComponent,
    ProcutMiniatureComponentComponent,
    ConfirmDeleteComponent,
    OperationStatusComponent,
    ValidationErrorMessageComponent,
    GeneretePasswordDirective,

    ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    RouterModule.forRoot([
      { path: '', component: LoginComponent },
      { path: 'orders', component: OrdersComponent},
      { path: 'orders/addOrUpdateOrConfirmOrder', component: CreateOrderComponent},
      { path: 'orders/drawing', component: OrderDrawingComponent},
      {path: 'orders/orderVersionRegister', component: OrderVersionRegisterComponent},
      {path: 'materials', component: MaterialsComponent },
      { path: 'materials/add', component: CreateNewMaterialComponent},
      { path: 'materials/update', component: UpdateMaterialComponent},
      {path: 'dimensionCodes', component: DimensionCodesMainComponent },
      { path: 'dimensionCodes/add', component: CreateDimensionCodeComponent},
      { path: 'users', component: UsersComponent},
      { path: 'users/add', component: CreateNewUserComponent},
      { path: 'users/update', component: UpdateUserComponent},
      { path: 'users/changePassword', component: ChangePasswordComponent},
      { path: 'businessPartners', component: BusinessPartnersComponent},
      { path: 'businessPartners/:pageNumber', component: BusinessPartnersComponent},
      { path: 'addbusinessPartners', component: CreateBusinesPartnerComponent},
      { path: 'updatebusinessPartners', component: UpdateBusinessPartnerComponent},
      { path: 'changePasswordBusinessPartners', component: BusinessPartnerChangePasswordComponent},
      { path: 'products', component: ProductComponent},
      { path: 'products/add', component: CreateProductComponent},
      { path: 'products/types', component: ProductTypeComponent},
      { path: 'products/types/add', component: CreateProductTypeComponent},
      { path: 'products/bottoms', component: ProductBottomComponent},
      { path: 'products/bottoms/add', component: CreateProductBottomComponent},
      { path: 'products/tops', component: ProductTopComponent},
      { path: 'products/tops/add', component: CreateProductTopComponent},
      { path: 'products/chooseByMiniature', component: ProcutMiniatureComponentComponent},
      {path: 'login', component: LoginComponent },
      {path: 'languages', component: LanguageMainComponent},
      {path: 'languages/create', component: CreateOrUpdateLanguageComponent},
      {path: 'vocabularies', component: VocabularyMainComponentComponent},
      {path: 'vocabularies/add', component: CreateOrUpdateVocabularyComponent},
      {path: 'changePasswordByLoggedUser', component: ChangePasswordForLoggedUserComponent},
      ],{onSameUrlNavigation: 'reload', })
  ],
  providers: [

    {provide: HTTP_INTERCEPTORS, useClass: ErrorsInterceptorService, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: AddAuthorizationCookieInterceptorService, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
