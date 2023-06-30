# 📦 Importações

O código importa os módulos Discord e AWS necessários para o funcionamento do bot.
# 🤖 Cliente do Discord

É criada uma nova instância do cliente do Discord.
# 🔒 Configuração de Credenciais da AWS

As credenciais da AWS são configuradas utilizando as chaves de acesso fornecidas.
# 🌍 Configuração da Região da AWS

A região da AWS é configurada para 'us-east-1', mas pode ser substituída pela região de preferência.
# 🔌 Conexão do EC2

É criada uma instância do cliente EC2 utilizando as configurações definidas.
🔢 Prefixo do Bot

É definido o prefixo '&' para os comandos do bot.
# ⚙️ Evento 'ready'

Quando o bot estiver pronto, o evento 'ready' é acionado e exibe uma mensagem no console.
# 📥 Evento 'message'

O evento 'message' é acionado sempre que uma mensagem é recebida no servidor do Discord.
# ⚠️ Verificação de Comandos

O código verifica se a mensagem começa com o prefixo definido e se o autor da mensagem não é um bot. Caso contrário, o comando é ignorado.
# 🔄 Separação de Comando e Argumentos

O comando e os argumentos são separados a partir da mensagem recebida.
# 🔍 Comando 'verificar'

O código verifica se o comando é 'verificar'.
# ❗️ Verificação de Argumentos

É verificado se foi fornecido um único argumento (nome da instância) para realizar a verificação.
# ✅ Obtenção do Nome da Instância

O nome da instância é obtido a partir dos argumentos.
# 📋 Parâmetros da Instância

Os parâmetros da instância são definidos com base no nome fornecido.
# 🔍 Verificação da Existência da Instância

É realizada uma chamada assíncrona para a AWS para verificar se a instância existe.
# ❌ Instância Não Encontrada

Se a resposta da chamada indicar que não há reservas para a instância, uma mensagem de erro é enviada no chat do Discord.
# 🔍 Verificação de Regras de Firewall

Se a instância existir, o código verifica se ela possui regras de firewall ativas.
# ❌ Regras de Firewall Ausentes

Se a instância não possuir regras de firewall, uma mensagem de erro é enviada no chat do Discord.
# 🔍 Verificação das Regras de Firewall

Se a instância possuir regras de firewall, o código verifica cada uma delas.
# 🔍 Obtenção dos Detalhes da Regra

São obtidos detalhes como tipo de regra, porta aberta e origem autorizada.
# 📩 Envio de Mensagem de Resposta

Uma mensagem de resposta é enviada no chat do Discord, informando os detalhes da regra encontrada.
# ⚠️ Tratamento de Erros

Se ocorrer algum erro durante o processo de verificação, uma mensagem de erro é enviada no chat do Discord.
