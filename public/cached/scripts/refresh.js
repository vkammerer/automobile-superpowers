(() => {
  const refreshIframe = () => {
    document.querySelector('iframe').src = '';
    document.querySelector('iframe').src = 'https://www.reservauto.net/Scripts/Client/Mobile/Default.asp?BranchID=1';
  };

  document.querySelector('#refreshButton').onclick = refreshIframe;
})();
