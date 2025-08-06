document.addEventListener('DOMContentLoaded', function() {
    const chatBox = document.getElementById('chatBox');
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');
    const maxTokens = document.getElementById('maxTokens');
    const temperature = document.getElementById('temperature');
    const tempValue = document.getElementById('tempValue');
    
    // Atualiza o valor exibido do temperature
    temperature.addEventListener('input', function() {
        tempValue.textContent = this.value;
    });
    
    // Envia mensagem ao clicar no botão ou pressionar Enter
    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;
        
        // Adiciona mensagem do usuário ao chat
        addMessage('user', message);
        userInput.value = '';
        
        // Mostra "Digitando..." enquanto espera a resposta
        const typingIndicator = addMessage('ai', 'Digitando...', true);
        
        // Configuração para a API (substitua pela sua URL de backend)
        const backendUrl = 'https://seu-backend.herokuapp.com/chat';
        
        // Dados para enviar ao backend
        const requestData = {
            message: message,
            max_tokens: parseInt(maxTokens.value),
            temperature: parseFloat(temperature.value)
        };
        
        // Faz a chamada para o backend
        fetch(backendUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData)
        })
        .then(response => response.json())
        .then(data => {
            // Substitui "Digitando..." pela resposta real
            if (data.response) {
                typingIndicator.querySelector('.message-content').textContent = data.response;
            } else {
                typingIndicator.querySelector('.message-content').textContent = 'Erro ao obter resposta.';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            typingIndicator.querySelector('.message-content').textContent = 'Erro na conexão com a IA.';
        });
    }
    
    function addMessage(role, content, isTyping = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${role}-message`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.textContent = content;
        
        messageDiv.appendChild(contentDiv);
        chatBox.appendChild(messageDiv);
        
        // Rolagem automática para a última mensagem
        chatBox.scrollTop = chatBox.scrollHeight;
        
        return isTyping ? messageDiv : null;
    }
});
