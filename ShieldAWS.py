// Importando os módulos necessários
const Discord = require('discord.js');
const AWS = require('aws-sdk');

// Criando nova instância do client do discord
const client = new Discord.Client();

// Configurando o acesso as credenciais da AWS
AWS.config.update({
  accessKeyId: 'YOUR_AWS_ACCESS_KEY',
  secretAccessKey: 'YOUR_AWS_SECRET_KEY',
});

// Definindo o objeto da conexão do EC2
const ec2 = new AWS.EC2();

// Definindo o código do prefixo do bot
const prefix = '&';

// Quando o bot estiver pronto, ele exibirá este evento para o console
client.on('ready', () => {
  console.log('Bot está pronto!');
});

// Verificar os comandos recebidos
client.on('message', message => {
  // Caso o prefixo não fornecido esteja lá, ignoramos o comando
  if (!message.content.startsWith(prefix)) return;

  // Separar o comando da mensagem
  const args = message.content.slice(prefix.length).trim().split(' ');
  const command = args.shift().toLowerCase();

  // Verificar o comando 'verificar'
  if (command === 'verificar') {
    // Verificar os argumentos do comando
    if (args.length !== 1) {
      return message.reply('Você precisa fornecer o nome da instância para realizar a verificação!');
    }
    // Obter o nome da instância
    const instanceName = args[0];
    // Definir os parâmetros da instância
    const params = {
      Filters: [
        {
          Name: 'tag:Name',
          Values: [instanceName]
        }
      ]
    };
    // Verificar se a instância existe
    ec2.describeInstances(params, (err, data) => {
      if (err) {
        // Em caso de erro, informe ao usuário
        return message.reply(`Erro ao verificar a segurança da instância ${instanceName}: ${err.message}`);
      } else {
        // Verificar se a instância existe
        if (data.Reservations.length === 0) {
          return message.reply(`Nenhuma instância com o nome '${instanceName}' foi encontrada!`);
        }
        // Verificar todas as instâncias
        data.Reservations.forEach(reservation => {
          reservation.Instances.forEach(instance => {
            // Verificar se a instância possui regras de firewall
            if (instance.SecurityGroups.length === 0) {
              return message.reply(`A instância '${instanceName}' não possui regras de firewall ativas!`);
            }
            // Verificar todas as regras de firewall da instância
            instance.SecurityGroups.forEach(securityGroup => {
              // Verificar todas as regras da instância
              const rulesParams = {
                GroupId: securityGroup.GroupId
              };
              ec2.describeSecurityGroups(rulesParams, (err, sgData) => {
                if (err) {
                  return message.reply(`Erro ao verificar a segurança da instância '${instanceName}': ${err.message}`);
                }
                // Verificar todas as regras da instância
                sgData.SecurityGroups[0].IpPermissions.forEach(rule => {
                  // Verificar o tipo da regra
                  const type = rule.IpProtocol === '-1' ? 'All' : rule.IpProtocol;
                  // Verificar a porta aberta
                  const port = rule.FromPort === -1 ? 'All' : rule.FromPort;
                  // Verificar quem está autorizado a se conectar
                  const source = rule.IpRanges.length > 0 ? rule.IpRanges[0].CidrIp : 'All';
                  // Avisar o usuário
                  message.reply(`Regra '${type}' encontrada na porta '${port}' para '${source}'`);
                });
              });
            });
          });
        });
      }
    });
  }
});

// Logar o bot usando o token
client.login('YOUR_BOT_TOKEN');
