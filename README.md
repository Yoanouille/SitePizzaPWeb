# Projet PWEB

Projet Web Licence 3

## Utilisation

Il vous faut une base de données auxquels vous avez accès.
De base cette base de données doit avoir pour nom 'bd-web'
Mais vous pouvez en choisir un autre pour cette base de données, il faudra alors renseigner ce nom lors du lancement du serveur.

Pour initialiser la base de données, il faut executer le script 'init.sql'

Dans postgres :
```
\i init.sql
```


Lancer le serveur : 

```
node main.js [user] [password] [Optional: database]
```

Exemple :
```
node main.js etudiant motdepasse BD
```
Cette commande permet au serveur de se connecter à la base de données 'BD' en tant que 'etudiant' en utilisant le password 'motdepasse'. Si la base de données n'est pas renseignée, alors le serveur tentera de se connecter à la base de données 'bd-web'
