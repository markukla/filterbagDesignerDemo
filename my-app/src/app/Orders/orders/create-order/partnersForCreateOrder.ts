import User from "../../../Users/users/userTypes/user";

 export class PartnersForCreateOrder{
  codeAndName: string;
  id: number;
  user: User;





  }

  export const createPartnersForCreateOrderFromPartners= (partners: User[]):PartnersForCreateOrder[]=>
{
const partnersForCreateOrder: PartnersForCreateOrder[] = [];
partners.forEach((partner)=> {
  const partnerForCreateOrder: PartnersForCreateOrder= {
    user: partner,
    codeAndName:  partner.code+ ' - '+partner.businesPartnerCompanyName+ ' : '+ partner.fulName,
    id: partner.id
  } ;
partnersForCreateOrder.push(partnerForCreateOrder);
});
return partnersForCreateOrder;
}

