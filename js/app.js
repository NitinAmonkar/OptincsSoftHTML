const invoiceDues = {
    "SI-2026-00482": 3500,
    "SI-2026-00481": 7980,
    "SI-2026-00480": 0
};
function toggleSidebar() {
    document.body.classList.toggle('compact');
}

function filterTable(input) {
    const q = input.value.toLowerCase();
    const table = input.closest('.card')?.querySelector('tbody');

    if (!table) return;

    [...table.rows].forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(q) ? '' : 'none';
    });
}

function addRow() {
    const body = document.querySelector('#items tbody');
    if (!body) return;

    const n = body.rows.length + 1;

    body.insertAdjacentHTML('beforeend', `
        <tr>
            <td>${n}</td>
            <td><input class="inline" value="FRAME-${100 + n}"></td>
            <td>Frame</td>
            <td><input class="qty" type="number" value="1" min="1"></td>
            <td><input value="2500"></td>
            <td><input value="0"></td>
            <td class="line-total">₹2,500</td>
            <td>
                <button class="btn sm danger" type="button"
                    onclick="this.closest('tr').remove(); recalc()">×</button>
            </td>
        </tr>
    `);
}

function recalc() {
    let total = 0;

    document.querySelectorAll('#items tbody tr').forEach(row => {
        const inputs = row.querySelectorAll('input');

        const quantity = parseFloat(inputs[1]?.value || 1);
        const price = parseFloat(inputs[2]?.value || 0);
        const discount = parseFloat(inputs[3]?.value || 0);

        const value = quantity * price * (1 - discount / 100);
        total += value;

        const cell = row.querySelector('.line-total');

        if (cell) {
            cell.textContent = '₹' + value.toLocaleString('en-IN', {
                maximumFractionDigits: 0
            });
        }
    });

    const formattedTotal = '₹' + total.toLocaleString('en-IN', {
        maximumFractionDigits: 0
    });

    const subtotal = document.querySelector('#subtotal');
    const grandTotal = document.querySelector('#grandtotal');

    if (subtotal) subtotal.textContent = formattedTotal;
    if (grandTotal) grandTotal.textContent = formattedTotal;
}

document.addEventListener('input', event => {
    if (event.target.closest('#items')) {
        recalc();
    }
});

// Shared sidebar loader
document.addEventListener('DOMContentLoaded', async function () {
    const sidebarContainer = document.getElementById('sidebar-container');

    // Pages without a sidebar, such as login, are unaffected.
    if (!sidebarContainer) return;

    try {
        const response = await fetch('./partials/sidebar.html');

        if (!response.ok) {
            throw new Error(`Sidebar request failed: ${response.status}`);
        }

        sidebarContainer.innerHTML = await response.text();

        const currentPage =
            window.location.pathname.split('/').filter(Boolean).pop()
            || 'dashboard.html';

        sidebarContainer.querySelectorAll('a.nav').forEach(link => {
            const linkPage = link.getAttribute('href');

            if (linkPage === currentPage) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            }
        });
    } catch (error) {
        console.error('Sidebar loading failed:', error);

        sidebarContainer.innerHTML = `
            <aside class="sidebar">
                Navigation could not be loaded.
                Please refresh the page.
            </aside>
        `;
    }
});


function toggleReportsMenu(button) {
    const group = button.closest('.nav-group');
    if (!group) return;

    const isOpen = group.classList.toggle('open');
    button.setAttribute('aria-expanded', String(isOpen));
}

const currentPage =
    window.location.pathname.split('/').filter(Boolean).pop()
    || 'dashboard.html';

sidebarContainer.querySelectorAll('a.nav, .nav-submenu a').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');

        const group = link.closest('.nav-group');
        if (group) {
            group.classList.add('open');
            group.querySelector('.nav-dropdown')
                ?.setAttribute('aria-expanded', 'true');
        }
    }
}); function confirmDeliveryDate(input, invoiceNo) {
    const oldDate = input.dataset.originalDate;
    const newDate = input.value;

    if (!newDate || newDate === oldDate) {
        return;
    }

    const confirmed = confirm(
        `Update delivery date for ${invoiceNo}?\n\n` +
        `Old date: ${oldDate}\n` +
        `New date: ${newDate}`
    );

    if (confirmed) {
        // TODO: Save the new date through the backend.
        input.dataset.originalDate = newDate;
        alert("Delivery date confirmed. Save functionality is pending.");
    } else {
        input.value = oldDate;
    }
}




function collectDues(invoiceNo) {

    let activeDuesInvoice = "";
    const invoiceDues = {
        "SI-2026-00482": 3500,
        "SI-2026-00481": 7980,
        "SI-2026-00480": 0
    };
    const outstanding = invoiceDues[invoiceNo] ?? 0;

    if (outstanding <= 0) {
        alert("There are no outstanding dues for this invoice.");
        return;
    }

    activeDuesInvoice = invoiceNo;

    document.getElementById("duesInvoiceNo").textContent =
        "Invoice: " + invoiceNo;

    document.getElementById("duesOutstanding").textContent =
        "₹" + outstanding.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

    const amountInput = document.getElementById("duesAmount");
    amountInput.value = outstanding.toFixed(2);
    amountInput.max = outstanding;
    amountInput.setCustomValidity("");

    document.getElementById("collectDuesModal").style.display = "flex";
}

function closeDuesModal() {
    document.getElementById("collectDuesModal").style.display = "none";
    document.getElementById("collectDuesForm").reset();
    document.getElementById("duesAmount").setCustomValidity("");
    activeDuesInvoice = "";
}

function saveDuesCollection(event) {
    event.preventDefault();

    const amountInput = document.getElementById("duesAmount");
    const amount = Number(amountInput.value);
    const outstanding = invoiceDues[activeDuesInvoice] ?? 0;

    if (!Number.isFinite(amount) || amount <= 0) {
        amountInput.setCustomValidity("Enter an amount greater than zero.");
        amountInput.reportValidity();
        return;
    }

    if (amount > outstanding) {
        amountInput.setCustomValidity(
            "Collection cannot exceed the outstanding amount."
        );
        amountInput.reportValidity();
        return;
    }

    amountInput.setCustomValidity("");

    const method = document.querySelector(
        'input[name="duesPaymentMethod"]:checked'
    ).value;

    // Demo only: replace with a backend API request.
    alert(
        "Collection details validated.\n" +
        "Invoice: " + activeDuesInvoice + "\n" +
        "Amount: ₹" + amount.toLocaleString("en-IN") + "\n" +
        "Payment: " + method + "\n\n" +
        "Database saving is not connected yet."
    );

    closeDuesModal();
}