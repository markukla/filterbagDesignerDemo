
const addBlockedUserClass= (button: HTMLButtonElement)=>{
  button.classList.remove('userActivetedButton');
  button.classList.add('userBlockedButton');
  button.classList.add('icon');
  button.classList.add('action-button');
}
const addActiveUserClass= (button: HTMLButtonElement)=>{
  button.classList.remove('userBlockedButton');
  button.classList.add('userActivetedButton');
  button.classList.add('icon');
  button.classList.add('action-button');
}
export {addBlockedUserClass,addActiveUserClass};
