document.addEventListener('DOMContentLoaded', function() {
    const elems = document.querySelectorAll('.sidenav');
    M.Sidenav.init(elems);

    const dropdown = document.querySelectorAll('.dropdown-trigger');
    M.Dropdown.init(dropdown, {
        constrainWidth: true,
    });

    const select = document.querySelectorAll('select');
    M.FormSelect.init(select);
});