const Discord = require('discord.js');
const AWS = require('aws-sdk');
require('dotenv').config(); // Utilize um arquivo .env para armazenar suas variáveis sensíveis

const client = new Discord.Client();

const awsConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: 'us-east-1'
};
AWS.config.update(awsConfig);

const ec2 = new AWS.EC2();
const prefix = '&';

client.once('ready', () => {
  console.log('Bot está pronto!');
});

client.on('message', async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  try {
    await executarComando(command, args, message);
  } catch (error) {
    message.reply(`Erro ao executar o comando '${command}': ${error.message}`);
    console.error(error);
  }
});

async function exibirComando(command, message) {
  switch (command) {
    case 'verificar':
      const verificarEmbed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Comando - &verificar')
        .setDescription('Verifica as regras de firewall de uma instância específica.')
        .addField('Uso', '&verificar <nome_da_instância>', false)
        .addField('Exemplo', '&verificar MinhaInstancia', false);
      message.channel.send(verificarEmbed);
      break;
    default:
      message.reply('Comando desconhecido!');
      break;
  }
}

async function executarComando(command, args, message) {
  switch (command) {
    case 'verificar':
      await verificarCommand(args, message);
      break;
    case 'ajuda':
      exibirAjuda(message);
      break;
    case 'comando':
      if (args.length !== 1) {
        message.reply('Forneça o nome de um comando para obter detalhes!');
      } else {
        await exibirComando(args[0], message);
      }
      break;
    default:
      message.reply('Comando inválido!');
      break;
  }
}

function exibirAjuda(message) {
  const helpEmbed = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setTitle('Ajuda do Bot')
    .setDescription('Lista de comandos disponíveis:')
    .addField('&verificar <nome_da_instância>', 'Verifica as regras de firewall de uma instância específica', false)
    .addField('&ajuda', 'Exibe a lista de comandos disponíveis', false)
    .addField('&comando <nome_do_comando>', 'Exibe detalhes sobre um comando específico', false);
  message.channel.send(helpEmbed);
}

async function verificarCommand(args, message) {
  if (args.length !== 1) {
    return message.reply('Forneça o nome da instância para a verificação!');
  }

  const instanceName = args[0];

  const params = {
    Filters: [
      {
        Name: 'tag:Name',
        Values: [instanceName]
      }
    ]
  };

  try {
    const data = await ec2.describeInstances(params).promise();

    if (data.Reservations.length === 0) {
      return message.reply(`Nenhuma instância com o nome '${instanceName}' foi encontrada!`);
    }

    for (const reservation of data.Reservations) {
      for (const instance of reservation.Instances) {
        if (instance.SecurityGroups.length === 0) {
          return message.reply(`A instância '${instanceName}' não possui regras de firewall ativas!`);
        }

        for (const securityGroup of instance.SecurityGroups) {
          const rulesParams = {
            GroupIds: [securityGroup.GroupId]
          };

          const sgData = await ec2.describeSecurityGroups(rulesParams).promise();

          for (const rule of sgData.SecurityGroups[0].IpPermissions) {
            const type = rule.IpProtocol === '-1' ? 'All' : rule.IpProtocol;
            const port = rule.FromPort === -1 ? 'All' : rule.FromPort;
            const source = rule.IpRanges.length > 0 ? rule.IpRanges[0].CidrIp : 'All';
            message.reply(`Regra '${type}' na porta '${port}' para '${source}'`);
          }
        }
      }
    }
  } catch (error) {
    throw new Error(`Erro ao verificar a instância '${instanceName}': ${error.message}`);
  }
}

client.login(process.env.BOT_TOKEN); // Utilize um arquivo .env para armazenar seu token do bot Discord


