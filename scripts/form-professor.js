/* ----------- Validação de Email ----------- */
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/* ----------- Validação de CPF ----------- */
function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, "");

    if (cpf.length !== 11) return false;
    if (/^(.)\1+$/.test(cpf)) return false;

    let soma = 0, resto;

    for (let i = 1; i <= 9; i++)
        soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);

    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++)
        soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);

    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;

    return true;
}

/* ----------- Máscara CPF ----------- */
document.getElementById("cpf").addEventListener("input", function (e) {
    let v = e.target.value.replace(/\D/g, "");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    e.target.value = v;
});

/* ----------- Toggle Senha ----------- */
function setupTogglePassword(toggleId, inputId) {
    const toggle = document.getElementById(toggleId);
    const input = document.getElementById(inputId);

    toggle.addEventListener("click", () => {
        const hidden = input.type === "password";
        input.type = hidden ? "text" : "password";
        toggle.textContent = hidden ? "$" : "%";
        toggle.setAttribute("aria-pressed", String(!hidden));
    });
}

setupTogglePassword("toggleSenha", "senha");
setupTogglePassword("toggleConfirmarSenha", "confirmarSenha");

/* ----------- Multi-Step ----------- */
const form = document.getElementById('multiStepForm');
const steps = Array.from(form.querySelectorAll('fieldset[data-step]'));
let currentStep = 0;

const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');

function showStep(index) {
    steps.forEach((step, i) => step.hidden = i !== index);
    currentStep = index;
    const pct = Math.round(((index + 1) / steps.length) * 100);
    progressBar.style.width = pct + "%";
    progressText.textContent = `Etapa ${index + 1} de ${steps.length}`;
}

function validateStep(index) {
    const fields = steps[index].querySelectorAll("[required]");
    let valid = true;

    fields.forEach(f => {
        if (!f.value.trim()) {
            f.classList.add("invalid");
            valid = false;
        } else {
            f.classList.remove("invalid");
        }
    });

    return valid;
}

/* ---- Next Step ---- */
document.getElementById("nextBtn1").addEventListener("click", () => {
    if (!validateStep(0)) {
        alert("Preencha todos os campos obrigatórios da etapa 1.");
        return;
    }

    if (!validarEmail(form.email.value)) {
        alert("Por favor, insira um e-mail válido.");
        return;
    }

    if (form.senha.value !== form.confirmarSenha.value) {
        alert("As senhas não coincidem.");
        return;
    }

    showStep(1);
});

/* ---- Voltar ---- */
document.getElementById("backBtn2").addEventListener("click", () => showStep(0));

/* ----------- Submit ----------- */
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validateStep(currentStep)) {
        alert("Preencha todos os campos obrigatórios da etapa 2.");
        return;
    }

    if (!validarCPF(form.cpf.value)) {
        alert("CPF inválido. Verifique e tente novamente.");
        return;
    }

    const payload = {
        nome: form.nome.value.trim(),
        email: form.email.value.trim(),
        password: form.senha.value.trim(),
        cpf: form.cpf.value.trim(),
        tipo: 1, // professor fixo
        descricao: form.descricao.value.trim(),
        certificacoes: form.certificacoes.value.split(',').map(s => s.trim()),
        competencias: form.competencias.value.split(',').map(s => s.trim()),
        valorHora: parseFloat(form.valorHora.value)
    };

    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';
    
    console.log(payload)

    try {
        const response = await fetch('/api/professores', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error(await response.text());

        alert('Cadastro realizado com sucesso!');
        form.reset();
        showStep(0);

    } catch (err) {
        alert('Erro ao cadastrar: ' + err.message);

    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Cadastrar';
    }
});

showStep(0);
