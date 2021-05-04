
const addBlockedUserClass= (button: HTMLButtonElement)=>{
  button.classList.remove('userActivetedButton');
  button.classList.add('userBlockedButton')

}
const addActiveUserClass= (button: HTMLButtonElement)=>{
  button.classList.remove('userBlockedButton');
  button.classList.add('userActivetedButton');
}
export {addBlockedUserClass,addActiveUserClass};
