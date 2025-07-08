document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Element References ---
    const homeSection = document.getElementById('home-section');
    const formSection = document.getElementById('form-section');
    const ledgerSection = document.getElementById('ledger-section');

    const navHomeBtn = document.getElementById('nav-home');
    const navLedgerBtn = document.getElementById('nav-ledger');
    const reportBtn = document.getElementById('report-btn');

    const complaintForm = document.getElementById('complaint-form');
    const caseFilesContainer = document.getElementById('case-files-container');

    // --- State & Data ---
    // Load submissions from browser's local storage or initialize an empty array
    let submissions = JSON.parse(localStorage.getItem('anniyanSubmissions')) || [];

    // --- Functions ---

    // Function to switch between "pages" (sections)
    const showSection = (sectionToShow) => {
        homeSection.classList.remove('active');
        formSection.classList.remove('active');
        ledgerSection.classList.remove('active');
        sectionToShow.classList.add('active');
    };

    // Function to render the case files in the "Book of Sins"
    const renderLedger = () => {
        caseFilesContainer.innerHTML = ''; // Clear previous entries

        if (submissions.length === 0) {
            caseFilesContainer.innerHTML = '<p>The Book is clean. For now.</p>';
            return;
        }

        submissions.forEach(sub => {
            // Randomly decide the status for demonstration purposes
            const status = Math.random() > 0.6 ? 'Judgement Delivered' : 'Under Anniyan\'s Gaze';
            const statusClass = status === 'Judgement Delivered' ? 'status-judged' : 'status-pending';
            const punishment = getGarudaPuranaPunishment(sub.injustice);

            const caseFileHTML = `
                <div class="case-file">
                    <h3>Case #${sub.id}</h3>
                    <p><strong>Offender:</strong> ${escapeHTML(sub.offender)}</p>
                    <p><strong>Injustice:</strong> ${escapeHTML(sub.injustice)}</p>
                    <p><strong>Details:</strong> ${escapeHTML(sub.details)}</p>
                    <p class="status ${statusClass}">${status}</p>
                    ${status === 'Judgement Delivered' ? `<p><strong>Punishment:</strong> ${punishment}</p>` : ''}
                </div>
            `;
            caseFilesContainer.insertAdjacentHTML('beforeend', caseFileHTML);
        });
    };
    
    // Simple function to prevent Cross-Site Scripting (XSS) by escaping HTML
    const escapeHTML = (str) => {
        const div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    };

    // Thematic punishment descriptions from Garuda Purana
    const getGarudaPuranaPunishment = (injusticeType) => {
        const punishments = {
            'Corruption / Bribery': 'Andhakupam: Crushed by animals.',
            'Public Apathy': 'Kumbhipakam: Boiled in oil.',
            'Disrespecting Public Property': 'Vajrakantakasali: Forced to embrace red-hot iron statues.',
            'Food Adulteration': 'Krimibhojanam: Eaten by insects and worms.',
            'Tax Evasion': 'Taptamurti: Burnt alive.',
            'Breaking Traffic Rules': 'Shulaprotam: Impaled on a sharp trident.',
            'Other': 'Vaitarani: Thrown into a river of filth and blood.'
        };
        return punishments[injusticeType] || punishments['Other'];
    };


    // --- Event Listeners ---
    navHomeBtn.addEventListener('click', () => showSection(homeSection));
    reportBtn.addEventListener('click', () => showSection(formSection));
    navLedgerBtn.addEventListener('click', () => {
        renderLedger();
        showSection(ledgerSection);
    });

    // Handle the form submission
    complaintForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent actual form submission

        const newSubmission = {
            id: Date.now(), // Unique ID based on timestamp
            offender: complaintForm.offender.value,
            injustice: complaintForm['injustice-type'].value,
            details: complaintForm.details.value,
        };

        // Add the new submission to our array
        submissions.push(newSubmission);

        // Save the updated array to local storage
        localStorage.setItem('anniyanSubmissions', JSON.stringify(submissions));

        // Reset the form
        complaintForm.reset();

        // Show the updated ledger
        renderLedger();
        showSection(ledgerSection);
    });


    // --- Initial Load ---
    // Start on the home section when the page loads
    showSection(homeSection);

});