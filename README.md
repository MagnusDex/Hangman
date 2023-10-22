# Hangman - Full stack task

In this implementation of Hangman, where I get the random words from 
https://api-ninjas.com, I restrict the words to adjectives. This is 
because the nouns provided by that service are often quite obscure and
difficult to guess.

### Platform

This text is written from the Windows perspective, but is useful also
for other operation systems.

### Secret API Key
This application accesses an external API to get random words. 
This external service, https://api-ninjas.com/, requires you to sign
up and get an API Key. I don't include my API Key here in the repo.

When you have signed up and obtained your API Key, you must make it 
available to the application. You can either store it as an Environment 
variable, or use the Secret Manager tool, as described here:

https://learn.microsoft.com/en-us/aspnet/core/security/app-secrets

Notice that the Secret Manager system will only be useful if you run the
application from the IDE.

You must save the API Key with the name EXTERNAL_WORD_PROVIDER_API_KEY.

The application will then read it from either of these places.


### How to run the application
You can run the application directly from the IDE, and it should open
a browser that runs the game.

or

You can publish the application and then run it. 

#### Here I describe how to publish it to a local folder and run it from there:

In the IDE right click on the project in the Solution Explorer, and 
select Publish. Follow the instructions and select to publish it to 
a local folder.

When you run the published application it will not be able to find 
the API Key from the Secret Manager system. In this case you will need 
to store the API Key as an environment variable. (The application can of
course be modified to be able to get the API Key from a more robost secret 
management such as those available on Azure or AWS.)

If you open a command prompt, and issue this command:

    set EXTERNAL_WORD_PROVIDER_API_KEY=yourSecretApiKey

then that environment variable is only available in that command window 
(and will disappear after that command windows is closed). Then, from the
same command window, just run the Hangman.exe located in the folder where 
it was published.

When Hangman.exe is run, it will show something like the following

    info: Microsoft.Hosting.Lifetime[14]
      Now listening on: http://localhost:5000
    info: Microsoft.Hosting.Lifetime[14]
      Now listening on: https://localhost:5001
    info: Microsoft.Hosting.Lifetime[0]
      Application started. Press Ctrl+C to shut down.
    info: Microsoft.Hosting.Lifetime[0]
      Hosting environment: Production

You should now be able to open the game in a browser by Ctrl-clicking on 
either of the two URLs shown. Using the first one should result in a
redirect to the second one (SSL).

### Expose to internet

I do not cover here how to expose the web app to the internet.

