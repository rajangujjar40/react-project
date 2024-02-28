pipeline {
    agent {
        label 'reactjs2'
    }
    environment {
        PROJECT_NAME = '$PROJECT_NAME'
        BUILD_NUMBER = '$BUILD_NUMBER'
        BUILD_STATUS = '#' 
        CUSTOM_BUILD_URL = '$BUILD_URL'
    }
    stages {
        stage("Collecting Requirements") {
            steps {
                sh "echo Please wait.."
                sh "npm install"
            }
        }
        
        stage("Build") {
            steps {
               
                sh "CI=false npm run build"
            }
        }
        stage("Deploy") {
            steps {
                sh "rsync -rav --delete build/* administrator@172.16.0.235:/var/www/html/react-pipeline/development-arcadegame-24014185-react-admin/"
                sh "echo admin-arcadegame.mobiloitte.io"
            }
        }
    }
    post {
        always {
            script {
                // Update BUILD_STATUS based on build result
                def buildOutcome = currentBuild.resultIsBetterOrEqualTo('SUCCESS') ? 'SUCCESS' : 'FAILURE'
                BUILD_STATUS = buildOutcome

                emailext to: 'de-anil@mobiloitte.com,team-it@mobiloitte.com,re-suraji@mobiloitte.com,jitendra.gautam@indicchain.com',
                         subject: 'PROJECT BUILD STATUS via JENKINS',
                         body: """<html>
                                    <head>
                                        <style>
                                            .build-status {
                                                color: ${BUILD_STATUS == 'SUCCESS' ? 'green' : 'red'};
                                            }
                                        </style>
                                    </head>
                                    <body>
                                        <p>Hello,</p>
                                        <b><p>This notification is to inform you about your project's build has been $BUILD_STATUS .</p></b>
                                        <ul>
                                            <li><strong>Project Name:</strong> $PROJECT_NAME</li>
                                            <li><strong>Build Status:</strong> <span class="build-status">$BUILD_STATUS</span></li>
                                            <li><strong>Build Number:</strong> $BUILD_NUMBER</li>
                                            <li><strong>Build Log:</strong> <b><p>Attached Below</p></b></li>
                                        </ul>
                                    </body>
                                </html>""",
                         mimeType: 'text/html',
                         attachLog: true
            }
        }
    }
}
