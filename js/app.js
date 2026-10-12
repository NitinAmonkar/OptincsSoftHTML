
function toggleSidebar(){document.body.classList.toggle('compact')}
function filterTable(input){
  const q=input.value.toLowerCase();
  const table=input.closest('.card').querySelector('tbody');
  if(!table)return;
  [...table.rows].forEach(r=>r.style.display=r.innerText.toLowerCase().includes(q)?'':'none');
}
function addRow(){
 const body=document.querySelector('#items tbody'); if(!body)return;
 const n=body.rows.length+1;
 body.insertAdjacentHTML('beforeend',`<tr><td>${n}</td><td><input class="inline" value="FRAME-${100+n}"></td><td>Frame</td><td><input class="qty" type="number" value="1" min="1"></td><td><input value="2500"></td><td><input value="0"></td><td class="line-total">₹2,500</td><td><button class="btn sm danger" onclick="this.closest('tr').remove();recalc()">×</button></td></tr>`);
}
function recalc(){
 let total=0;
 document.querySelectorAll('#items tbody tr').forEach(r=>{
   const inputs=r.querySelectorAll('input'); const q=parseFloat(inputs[1]?.value||1), p=parseFloat(inputs[2]?.value||0), d=parseFloat(inputs[3]?.value||0);
   const v=q*p*(1-d/100); total+=v; const cell=r.querySelector('.line-total'); if(cell)cell.textContent='₹'+v.toLocaleString('en-IN',{maximumFractionDigits:0});
 });
 const sub=document.querySelector('#subtotal'); if(sub)sub.textContent='₹'+total.toLocaleString('en-IN',{maximumFractionDigits:0});
 const grand=document.querySelector('#grandtotal'); if(grand)grand.textContent='₹'+total.toLocaleString('en-IN',{maximumFractionDigits:0});
}
document.addEventListener('input',e=>{if(e.target.closest('#items'))recalc()});
