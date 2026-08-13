import { setRole } from "../js/storage.js";

export function initRoleSelect (){
  const roleCards = document.querySelectorAll(".roleCard");
  roleCards.forEach((card) => {
    card.addEventListener('click', () =>{
      const role = card.dataset.role;
      console.log(role)
      setRole(role);
    })
  } )
}