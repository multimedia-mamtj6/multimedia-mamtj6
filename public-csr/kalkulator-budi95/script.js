document.addEventListener('DOMContentLoaded', () => {
    // --- Logik Tab ---
    const tabs = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(item => item.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(tab.dataset.tab).classList.add('active');
        });
    });

    // --- KALKULATOR 1: KIRAAN PENUH ---
    const petrolFormFull = document.getElementById('petrol-form-full');
    const modeRmBtn = document.getElementById('mode-rm');
    const modeLiterBtn = document.getElementById('mode-liter');
    const userInputLabel = document.getElementById('user-input-label');
    const userInput = document.getElementById('user-input');
    const resetBtnFull = document.getElementById('reset-btn-full');
    const oldPriceInput = document.getElementById('old-price');
    const newPriceInput = document.getElementById('new-price');
    const resultCapacity = document.getElementById('result-capacity');
    const resultTotal = document.getElementById('result-total');
    const resultExplanation = document.getElementById('result-explanation-text');
    let currentMode = 'RM';

    const switchModeFull = (newMode) => {
        currentMode = newMode;
        userInput.value = '';
        if (newMode === 'RM') {
            modeRmBtn.classList.add('active');
            modeLiterBtn.classList.remove('active');
            userInputLabel.textContent = 'Jumlah anda bayar sebelum ini (RM)';
        } else {
            modeLiterBtn.classList.add('active');
            modeRmBtn.classList.remove('active');
            userInputLabel.textContent = 'Kapasiti tangki anda (Liter)';
        }
    };
    const resetCalculatorFull = () => {
        petrolFormFull.reset();
        oldPriceInput.value = '2.05'; newPriceInput.value = '1.99'; userInput.value = '36';
        switchModeFull('RM');
        resultCapacity.innerHTML = '0.00 <span class="unit">liter</span>';
        resultTotal.textContent = 'RM0.00'; resultExplanation.textContent = '';
    };
    const calculateFull = (event) => {
        event.preventDefault();
        const oldPrice = parseFloat(oldPriceInput.value); const newPrice = parseFloat(newPriceInput.value); const userValue = parseFloat(userInput.value);
        if (isNaN(oldPrice) || isNaN(newPrice) || isNaN(userValue) || userValue <= 0) return;
        let tankLiters = (currentMode === 'RM') ? userValue / oldPrice : userValue;
        let newTotalCost = tankLiters * newPrice;
        resultCapacity.innerHTML = `${tankLiters.toFixed(2)} <span class="unit">liter</span>`;
        resultTotal.textContent = `RM${newTotalCost.toFixed(2)}`;
        resultExplanation.textContent = `Berdasarkan kapasiti ${tankLiters.toFixed(2)} liter dan harga baru RM${newPrice.toFixed(2)}, jumlah yang perlu dibayar = RM${newTotalCost.toFixed(2)}.`;
    };
    modeRmBtn.addEventListener('click', () => switchModeFull('RM'));
    modeLiterBtn.addEventListener('click', () => switchModeFull('Liter'));
    petrolFormFull.addEventListener('submit', calculateFull);
    resetBtnFull.addEventListener('click', resetCalculatorFull);

    // --- KALKULATOR 2: ISI MINYAK ---
    const petrolFormTopUp = document.getElementById('petrol-form-topup');
    const modeSubsidiBtn = document.getElementById('mode-subsidi');
    const modeTanpaSubsidiBtn = document.getElementById('mode-tanpa-subsidi');
    const resetBtnTopUp = document.getElementById('reset-btn-topup');
    const tankCapacityInput = document.getElementById('tank-capacity');
    const totalBarsInput = document.getElementById('total-bars');
    const currentBarsInput = document.getElementById('current-bars');
    const fuelGaugeContainer = document.getElementById('fuel-gauge-container');
    const gaugeVisual = document.getElementById('fuel-gauge-visual');
    const topupLitersResult = document.getElementById('topup-liters');
    const topupCostLabel = document.getElementById('topup-cost-label');
    const topupCostResult = document.getElementById('topup-cost');
    const topupPumpCostItem = document.getElementById('topup-pump-cost-item');
    const topupPumpCostResult = document.getElementById('topup-pump-cost');
    const SUBSIDI_PRICE = 1.99;
    const PUMP_PRICE = 2.60;
    let topUpMode = 'subsidi';

    const switchModeTopUp = (newMode) => {
        topUpMode = newMode;
        if (newMode === 'subsidi') {
            modeSubsidiBtn.classList.add('active');
            modeTanpaSubsidiBtn.classList.remove('active');
            topupCostLabel.textContent = 'Harga Subsidi (Bayar)';
            topupPumpCostItem.style.display = 'block';
        } else {
            modeTanpaSubsidiBtn.classList.add('active');
            modeSubsidiBtn.classList.remove('active');
            topupCostLabel.textContent = 'Jumlah Perlu Dibayar';
            topupPumpCostItem.style.display = 'none';
        }
        // Kosongkan keputusan tapi kekalkan input
        gaugeVisual.innerHTML = '';
        fuelGaugeContainer.style.display = 'none';
    };

    const resetCalculatorTopUp = () => {
        petrolFormTopUp.reset();
        switchModeTopUp('subsidi'); // Set semula ke mod subsidi
        topupLitersResult.innerHTML = '0.00 <span class="unit">L</span>';
        topupCostResult.textContent = 'RM0.00';
        topupPumpCostResult.textContent = 'RM0.00';
    };
    
    const calculateTopUp = (event) => {
        event.preventDefault();
        const tankCapacity = parseFloat(tankCapacityInput.value); const totalBars = parseInt(totalBarsInput.value); const currentBars = parseInt(currentBarsInput.value);
        if (isNaN(tankCapacity) || isNaN(totalBars) || isNaN(currentBars) || tankCapacity <= 0 || totalBars <= 0) { alert('Sila masukkan semua nilai yang sah.'); return; }
        if (currentBars > totalBars) { alert('Baki bar semasa tidak boleh melebihi jumlah bar penuh.'); return; }

        const basePrice = (topUpMode === 'subsidi') ? SUBSIDI_PRICE : PUMP_PRICE;
        const litersPerBar = tankCapacity / totalBars;
        const costPerBar = litersPerBar * basePrice;
        const barsNeeded = totalBars - currentBars;
        const totalLitersNeeded = barsNeeded * litersPerBar;
        const totalCost = totalLitersNeeded * basePrice;

        topupLitersResult.innerHTML = `${totalLitersNeeded.toFixed(2)} <span class="unit">L</span>`;
        topupCostResult.textContent = `RM${totalCost.toFixed(2)}`;
        if(topUpMode === 'subsidi'){
            const totalPumpCost = totalLitersNeeded * PUMP_PRICE;
            topupPumpCostResult.textContent = `RM${totalPumpCost.toFixed(2)}`;
        }

        fuelGaugeContainer.style.display = 'block';
        gaugeVisual.innerHTML = '';
        for (let i = 1; i <= totalBars; i++) {
            const wrapper = document.createElement('div'); wrapper.className = 'bar-wrapper';
            const label = document.createElement('div'); label.className = 'bar-label'; label.textContent = `Bar ${i}`;
            const barDiv = document.createElement('div'); barDiv.classList.add('gauge-bar');
            if (i <= currentBars) { barDiv.classList.add('current'); } else { barDiv.classList.add('needed'); }
            const cumulativeLiters = litersPerBar * i;
            const cumulativeCost = litersPerBar * basePrice * i; // Guna basePrice untuk kiraan kumulatif juga
            barDiv.innerHTML = `<span>${cumulativeLiters.toFixed(2)} L</span><span>RM${cumulativeCost.toFixed(2)}</span>`;
            wrapper.appendChild(label); wrapper.appendChild(barDiv); gaugeVisual.appendChild(wrapper);
        }
    };

    modeSubsidiBtn.addEventListener('click', () => switchModeTopUp('subsidi'));
    modeTanpaSubsidiBtn.addEventListener('click', () => switchModeTopUp('tanpa-subsidi'));
    petrolFormTopUp.addEventListener('submit', calculateTopUp);
    resetBtnTopUp.addEventListener('click', resetCalculatorTopUp);
});
