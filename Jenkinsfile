/*
 * (C) Copyright 2019 Nuxeo (http://nuxeo.com/).
 * This is unpublished proprietary source code of Nuxeo SA. All rights reserved.
 * Notice of copyright on this source code does not indicate publication.
 *
 * Contributors:
 *     Nuxeo
 *
 */

properties([
    [$class: 'BuildDiscarderProperty', strategy: [$class: 'LogRotator', daysToKeepStr: '5', numToKeepStr: '5', artifactNumToKeepStr: '1']],
    [$class: 'GithubProjectProperty', displayName: '', projectUrlStr: 'https://github.com/nuxeo/nuxeo-conversions-service/']
])

pipeline {
  agent {
    label "builder-maven-java11-nuxeo"
  }
  environment {
    ORG = 'nuxeo'
    APP_NAME = 'sitecore'
    CHARTMUSEUM_CREDS = credentials('jenkins-x-chartmuseum')
    PREVIEW_VERSION = "0.0.0-SNAPSHOT-$BRANCH_NAME-$BUILD_NUMBER"
  }
  stages {
    stage('Deploy Master Environment') {
      when {
        branch 'master'
      }
      environment {
        TAG = 'latest'
        NAMESPACE = "$ORG-$APP_NAME-master"
      }
      steps {
        container('maven-nuxeo') {
          // Ensure namespace exists
          sh "kubectl create ns ${NAMESPACE} || true"
          // Copy secret that contains JWT secret into preview namespace
          sh "kubectl get secret sitecore-config --export -oyaml | kubectl apply --namespace ${NAMESPACE} -f -"
          sh "kubectl get secret instance-clid --export -oyaml | kubectl apply --namespace ${NAMESPACE} -f -"

          dir("charts/preview") {
            sh "jx step helm build"
            sh "jx preview --name ${APP_NAME} --namespace ${NAMESPACE}"
          }
        }
      }
    }
  }
  post {
    cleanup {
      cleanWs()
    }
  }
}
