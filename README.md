Deployment
==========
Run wildfly in standalone-full-ha mode. For clustering it might be necessary,
to add an option to use IPv4 stack.

```
JAVA_OPTS='-Djava.net.preferIPv4Stack=true' bin/standalone.sh -c standalone-full-ha.xml
```

Configuration
-------------
The project needs to define its security domain. For that it ships
a configuration script `core/install.cli`. It can be run using jboss-cli or via
maven using `mvn wildfly:execute-commands` from the core directory.

Backend
-------
Backend war can be deployed using maven by running `mvn wildfly:deploy` from
core directory.
To deploy without default H2 datasource, use `no-ds` maven profile (`mvn -Pno-ds wildfly:deploy`).

Frontend
--------
Frontend war can be deployed using maven by running `mvn wildfly:deploy` from
web directory.
